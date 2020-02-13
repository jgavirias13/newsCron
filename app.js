const mongoose = require('mongoose');
const config = require('./config');
const axios = require('axios').default;
const cheerio = require('cheerio');
const cron = require('node-cron');
const BreakingNewModel = require('./models/breakingNew');

//Conectar a base de datos
mongoose.connect(config.DB_STRING, {useNewUrlParser: true, useUnifiedTopology:true}, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Conectado a la base de datos");
    }
});
//'0 */4 * * *
cron.schedule('*/1 * * * *', () => {
    const now = new Date().toUTCString();
    console.log(now + '   Obteniendo noticias...')
    obtenerNoticias();
})



async function obtenerNoticias(){
    const html = await axios.get("https://cnnespanol.cnn.com");
    const $ = cheerio.load(html.data);
    const titles = $(".news__title");
    titles.each(async (index, element) => {
        const breakingNew = {
            title: $(element).text().trim(),
            link: $(element).children().attr("href")
        }
        try{
            const noticiaExistente = await BreakingNewModel.findOne({title: breakingNew.title, link: breakingNew.link});
            if(!noticiaExistente){
                await BreakingNewModel.create(breakingNew);
            }
        }catch(err){
            console.log("Error al intentar guardar la noticia");
            console.log(breakingNew);
            console.log(err);
        }
    });
}