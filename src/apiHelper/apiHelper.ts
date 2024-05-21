// src/api/serviceHelper.ts
export function apiHelper() {
    const _sandBoxMode: boolean = process.env.NODE_ENV === 'development';
  
    const _localHostUrl: string = "http://localhost57598/api/lxservices/";    
    const _productionUrl: string = "https://lx2.legalxgen.com/api/lxservices/";
    
    const getServiceUrl = () : string => {
      const _baseUrl: string = _sandBoxMode ? _productionUrl : _productionUrl;
      return _baseUrl;
    }
  
    return {
      getServiceUrl
    }
  }
  