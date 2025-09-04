import { base44 } from './base44Client';

// Temporary mock integrations for testing during migration
export const Core = {
  InvokeLLM: (data) => {
    console.log('Mock InvokeLLM called with:', data);
    return Promise.resolve({ result: 'Mock LLM response' });
  },
  SendEmail: (data) => {
    console.log('Mock SendEmail called with:', data);
    return Promise.resolve({ success: true });
  },
  UploadFile: (data) => {
    console.log('Mock UploadFile called with:', data);
    return Promise.resolve({ fileUrl: 'https://example.com/mock-file.jpg' });
  },
  GenerateImage: (data) => {
    console.log('Mock GenerateImage called with:', data);
    return Promise.resolve({ imageUrl: 'https://example.com/mock-image.jpg' });
  },
  ExtractDataFromUploadedFile: (data) => {
    console.log('Mock ExtractDataFromUploadedFile called with:', data);
    return Promise.resolve({ extractedData: {} });
  },
  CreateFileSignedUrl: (data) => {
    console.log('Mock CreateFileSignedUrl called with:', data);
    return Promise.resolve({ signedUrl: 'https://example.com/signed-url' });
  },
  UploadPrivateFile: (data) => {
    console.log('Mock UploadPrivateFile called with:', data);
    return Promise.resolve({ fileUrl: 'https://example.com/private-file.jpg' });
  }
};

export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;






