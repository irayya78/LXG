const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://lx2.legalxgen.com/api/lxservices';
  }
  return 'https://lx2.legalxgen.com/api/lxservices';
};

export default getApiBaseUrl;
