const http = require('http');

http.get('http://localhost:5000/ping', (res) => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Resposta da API:', data);
  });

}).on('error', (err) => {
  console.error('Erro ao fazer requisição:', err.message);
});
