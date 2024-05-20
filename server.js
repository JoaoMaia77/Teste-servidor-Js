const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Configuração do multer para armazenar os arquivos em public/assets/imgs/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'public', 'assets', 'imgs');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Adiciona um timestamp ao nome do arquivo
    }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/projeto-voluntariado', upload.array('inserirImagens', 10), (req, res) => {
    try {
        const formData = req.body;
        const files = req.files;

        // Adiciona os caminhos dos arquivos ao formData
        formData.inserirImagens = files.map(file => path.join('assets', 'imgs', file.filename));

        // Exemplo de gravação em um arquivo JSON
        const dbFilePath = path.join(__dirname, 'db.json');
        fs.readFile(dbFilePath, (err, data) => {
            if (err) throw err;
            const db = JSON.parse(data);
            db['projeto-voluntariado'] = db['projeto-voluntariado'] || [];
            db['projeto-voluntariado'].push(formData);
            fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), (err) => {
                if (err) throw err;
                console.log('Dados gravados com sucesso!');
                res.status(200).send('Dados enviados com sucesso!');
            });
        });
    } catch (error) {
        console.error('Erro ao processar solicitação:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
