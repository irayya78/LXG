const getApiBaseUrl = () => {

  const isProduction=false;
  if (isProduction) {
    return 'https://lx2.legalxgen.com/api/lxservices';
  }
   return 'http://localhost:57598/api/lxservices';
 
};

export default getApiBaseUrl;
  