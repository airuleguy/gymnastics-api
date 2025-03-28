import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UploadsService } from '../common/modules/uploads/uploads.service';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { MultipartFile } from '@fastify/multipart';

const pipeline = util.promisify(require('stream').pipeline);
const UPLOAD_DIR = './uploads';

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Controller('athletes')
export class AthletesController {
  constructor(
    private readonly athletesService: AthletesService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  async create(
    @Body() createAthleteDto: CreateAthleteDto,
    @Req() request: FastifyRequest,
  ) {
    console.log('Create athlete endpoint called');
    let athleteData: any = createAthleteDto;
    console.log('Initial athlete data:', athleteData);
    
    // Check if this is a multipart request
    if (request.isMultipart()) {
      try {
        console.log('Parsing multipart data...');
        
        // Get the file first
        const file = await request.file();
        console.log('File received:', file.filename, 'Type:', file.mimetype);
        
        // Process the file
        if (file && file.mimetype.startsWith('image/')) {
          console.log('Processing image file...');
          
          // Generate filename
          const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.filename)}`;
          const filepath = path.join(UPLOAD_DIR, filename);
          
          console.log('Saving file to:', filepath);
          
          // Save file using explicit buffer handling to avoid stream issues
          const chunks = [];
          for await (const chunk of file.file) {
            chunks.push(chunk);
          }
          
          // Write the buffer to file
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(filepath, buffer);
          console.log('File saved successfully using buffer method');
          
          // Create a multer-like file object for the StorageService
          const multerFile: Express.Multer.File = {
            fieldname: 'image',
            originalname: file.filename,
            encoding: 'utf-8',
            mimetype: file.mimetype,
            size: buffer.length,
            destination: UPLOAD_DIR,
            filename: filename,
            path: filepath,
            buffer: buffer,
            stream: null as any,
          };
          
          // Set image URL using our updated upload service
          const imageUrl = await this.uploadsService.uploadFile(multerFile);
          console.log('Image URL set to:', imageUrl);
          
          // Extract actual values from form fields
          const formData = {};
          
          // Process all fields and extract their values
          Object.entries(file.fields).forEach(([key, field]) => {
            if (key === 'image') return; // Skip the image field
            
            if (field && typeof field === 'object' && 'value' in field) {
              console.log(`Processing field ${key}, value: ${field.value}`);
              formData[key] = field.value;
            }
          });
          
          console.log('Extracted form data:', formData);
          
          // Create the final athlete data with form values and image URL
          athleteData = {
            ...formData,
            imageUrl
          };
        } else {
          console.log('No valid image file found or not an image');
          
          // Extract form data without image
          const formData = {};
          Object.entries(file.fields).forEach(([key, field]) => {
            if (field && typeof field === 'object' && 'value' in field) {
              formData[key] = field.value;
            }
          });
          
          athleteData = formData;
        }
      } catch (error) {
        console.error('Error processing multipart request:', error);
      }
    }
    
    console.log('Final athlete data to create:', athleteData);
    // Convert string fields to appropriate types
    if (athleteData.club && typeof athleteData.club === 'string') {
      try {
        athleteData.club = JSON.parse(athleteData.club);
      } catch (e) {
        console.error('Error parsing club JSON:', e);
      }
    }
    
    return this.athletesService.create(athleteData);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.athletesService.findAll(query);
  }

  @Get('club/:clubId')
  findByClubId(
    @Param('clubId') clubId: string,
    @Query() query: PaginationQueryDto
  ) {
    return this.athletesService.findByClubId(+clubId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athletesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateAthleteDto: UpdateAthleteDto,
    @Req() request: FastifyRequest,
  ) {
    console.log('Update endpoint called, ID:', id);
    console.log('Is multipart request:', request.isMultipart());
    
    let athleteData: any = updateAthleteDto || {};
    console.log('Initial athlete data:', athleteData);
    
    // Check if this is a multipart request
    if (request.isMultipart()) {
      try {
        console.log('Parsing multipart data...');
        
        // Get the file first
        const file = await request.file();
        console.log('File received:', file.filename, 'Type:', file.mimetype);
        
        // Process the file
        if (file && file.mimetype.startsWith('image/')) {
          console.log('Processing image file...');
          
          // If there was a previous image, delete it
          const athlete = await this.athletesService.findOne(+id);
          if (athlete && athlete.imageUrl) {
            console.log('Deleting previous image:', athlete.imageUrl);
            await this.uploadsService.deleteFile(athlete.imageUrl);
          }
          
          // Generate filename
          const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.filename)}`;
          const filepath = path.join(UPLOAD_DIR, filename);
          
          console.log('Saving file to:', filepath);
          
          // Save file using explicit buffer handling to avoid stream issues
          const chunks = [];
          for await (const chunk of file.file) {
            chunks.push(chunk);
          }
          
          // Write the buffer to file
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(filepath, buffer);
          console.log('File saved successfully using buffer method');
          
          // Create a multer-like file object for the StorageService
          const multerFile: Express.Multer.File = {
            fieldname: 'image',
            originalname: file.filename,
            encoding: 'utf-8',
            mimetype: file.mimetype,
            size: buffer.length,
            destination: UPLOAD_DIR,
            filename: filename,
            path: filepath,
            buffer: buffer,
            stream: null as any,
          };
          
          // Set image URL using our updated upload service
          const imageUrl = await this.uploadsService.uploadFile(multerFile);
          console.log('Image URL set to:', imageUrl);
          
          // Extract actual values from form fields
          const formData = {};
          
          // Process all fields and extract their values
          Object.entries(file.fields).forEach(([key, field]) => {
            if (key === 'image') return; // Skip the image field
            
            if (field && typeof field === 'object' && 'value' in field) {
              console.log(`Processing field ${key}, value: ${field.value}`);
              formData[key] = field.value;
            }
          });
          
          console.log('Extracted form data:', formData);
          
          // Create the final athlete data with form values and image URL
          athleteData = {
            ...formData,
            imageUrl
          };
        } else {
          console.log('No valid image file found or not an image');
        }
      } catch (error) {
        console.error('Error processing multipart request:', error);
      }
    }
    
    console.log('Final athlete data to update:', athleteData);
    // Convert string fields to appropriate types
    if (athleteData.club && typeof athleteData.club === 'string') {
      try {
        athleteData.club = JSON.parse(athleteData.club);
      } catch (e) {
        console.error('Error parsing club JSON:', e);
      }
    }
    
    return this.athletesService.update(+id, athleteData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Get athlete to check for image
    const athlete = await this.athletesService.findOne(+id);
    
    // If athlete has image, delete it first
    if (athlete && athlete.imageUrl) {
      console.log('Deleting athlete image:', athlete.imageUrl);
      await this.uploadsService.deleteFile(athlete.imageUrl);
    }
    
    return this.athletesService.remove(+id);
  }
  
  @Post(':id/image')
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    console.log('Image upload endpoint called for athlete ID:', id);
    
    // Verify athlete exists
    const athlete = await this.athletesService.findOne(+id);
    if (!athlete) {
      throw new BadRequestException(`Athlete with ID ${id} not found`);
    }
    
    // Handle file upload
    try {
      // Get the file
      const file = await request.file();
      
      if (!file || !file.mimetype.startsWith('image/')) {
        throw new BadRequestException('No valid image file provided');
      }
      
      // If there was a previous image, delete it
      if (athlete.imageUrl) {
        console.log('Deleting previous image:', athlete.imageUrl);
        await this.uploadsService.deleteFile(athlete.imageUrl);
      }
      
      // Generate filename
      const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.filename)}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      console.log('Saving file to:', filepath);
      
      // Save file using explicit buffer handling
      const chunks = [];
      for await (const chunk of file.file) {
        chunks.push(chunk);
      }
      
      // Write buffer to file
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(filepath, buffer);
      
      // Create a multer-like file object for the StorageService
      const multerFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: file.filename,
        encoding: 'utf-8',
        mimetype: file.mimetype,
        size: buffer.length,
        destination: UPLOAD_DIR,
        filename: filename,
        path: filepath,
        buffer: buffer,
        stream: null as any,
      };
      
      // Set image URL using our updated upload service
      const imageUrl = await this.uploadsService.uploadFile(multerFile);
      console.log('Image URL set to:', imageUrl);
      
      // Update athlete with new image URL
      await this.athletesService.update(+id, { imageUrl });
      
      return { imageUrl };
    } catch (error) {
      console.error('Error processing image upload:', error);
      throw new BadRequestException('Error processing image upload');
    }
  }
}
