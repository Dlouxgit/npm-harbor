import * as fs from 'fs';

export function readProjectJson(): any[] {
    const filePath = './project.json';
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    try {
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (error) {
      console.error('Failed to parse project.json:', error);
      return [];
    }
}
  
export function writeProjectJson(data: any[]): void {
    const filePath = './project.json';
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf-8');
}
  
export function addValueToProjectJson(value: any): void {
    const data = readProjectJson();
    data.push(value);
    writeProjectJson(data);
}
  
export function deleteValueFromProjectJson(registryName: any): void {
    const data = readProjectJson();
    const newData = data.filter((entry) => entry.registry !== registryName);
    writeProjectJson(newData);
}

