/**
 * Generate API Service files from OpenAPI spec
 * 
 * Usage: node scripts/generate-services.js
 * 
 * This script reads openapi.json and generates service files
 * following the pattern: StationService, VehicleService, etc.
 */

const fs = require('fs');
const path = require('path');

// Read OpenAPI spec
const openapiPath = path.join(__dirname, '..', 'openapi.json');
const outputDir = path.join(__dirname, '..', 'src', 'api');

if (!fs.existsSync(openapiPath)) {
  console.error('❌ openapi.json not found. Run: npm run gen:openapi:fetch');
  process.exit(1);
}

const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));

// Extract tags (will become services)
const tags = openapi.tags || [];
const paths = openapi.paths || {};

console.log('🚀 Generating API services from OpenAPI spec...\n');

// Group operations by tag
const serviceGroups = {};

Object.entries(paths).forEach(([pathUrl, methods]) => {
  Object.entries(methods).forEach(([method, operation]) => {
    if (!operation.tags || operation.tags.length === 0) return;
    
    const tag = operation.tags[0]; // Use first tag
    if (!serviceGroups[tag]) {
      serviceGroups[tag] = [];
    }
    
    serviceGroups[tag].push({
      method: method.toUpperCase(),
      path: pathUrl,
      operationId: operation.operationId,
      summary: operation.summary,
      parameters: operation.parameters || [],
      requestBody: operation.requestBody,
      responses: operation.responses,
    });
  });
});

// Generate service files
Object.entries(serviceGroups).forEach(([tag, operations]) => {
  const serviceName = tag.replace(/Controller$/, '').replace(/s$/, '');
  const className = `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}Service`;
  const fileName = `${serviceName.toLowerCase()}.api.ts`;
  
  const methods = operations.map(op => {
    // Clean method name: AuthController_login -> login
    let methodName = op.operationId
      .replace(/Controller_/g, '_')
      .replace(new RegExp(`^${tag}_`), '')
      .replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    
    // Remove "Controller" prefix if exists
    methodName = methodName.replace(/^[A-Z][a-z]+Controller/, '');
    methodName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
    
    const hasPathParams = op.path.includes('{');
    const hasQueryParams = op.parameters.some(p => p.in === 'query');
    const hasBody = !!op.requestBody;
    
    // Build method signature
    let params = [];
    if (hasPathParams) {
      const pathParams = op.path.match(/\{([^}]+)\}/g)?.map(p => p.slice(1, -1)) || [];
      params.push(...pathParams.map(p => `${p}: string`));
    }
    if (hasBody) {
      params.push('data: any');
    }
    if (hasQueryParams) {
      params.push('params?: any');
    }
    
    const paramsStr = params.length > 0 ? params.join(', ') : '';
    
    // Build API call
    let apiPath = op.path.replace(/\{([^}]+)\}/g, '${$1}');
    let apiCall = '';
    
    switch (op.method) {
      case 'GET':
        apiCall = hasQueryParams
          ? `ApiClient.get(\`${apiPath}\`, { params })`
          : `ApiClient.get(\`${apiPath}\`)`;
        break;
      case 'POST':
        apiCall = `ApiClient.post(\`${apiPath}\`, data)`;
        break;
      case 'PUT':
        apiCall = `ApiClient.put(\`${apiPath}\`, data)`;
        break;
      case 'PATCH':
        apiCall = `ApiClient.patch(\`${apiPath}\`, data)`;
        break;
      case 'DELETE':
        apiCall = `ApiClient.delete(\`${apiPath}\`)`;
        break;
    }
    
    return `  /**
   * ${op.summary || methodName}
   */
  async ${methodName}(${paramsStr}): Promise<any> {
    try {
      return await ${apiCall};
    } catch (error) {
      console.error('${methodName} error:', error);
      throw error;
    }
  }`;
  }).join('\n\n');
  
  const serviceContent = `/**
 * ${className}
 * Auto-generated from OpenAPI spec
 */

import ApiClient from '@/src/services/api.client';

class ${className} {
${methods}
}

export default new ${className}();
`;
  
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, serviceContent, 'utf-8');
  console.log(`✅ Generated: ${fileName}`);
});

console.log('\n✨ Done! Generated', Object.keys(serviceGroups).length, 'service files');
