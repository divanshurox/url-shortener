const express = require('express')
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet')
const monk = require('monk');
const yup = require('yup');
const { nanoid } = require('nanoid');

const app = express();

require('dotenv').config();

const db = monk(process.env.MONGODB_URI)

const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required()
});


app.get('/', (req, res) => {
    res.json({
        msg: 'butt.ly ~~ Short URLs to GO!'
    });
});


app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    try {
        const { url } = await urls.findOne({ slug });
        if (url) {
            res.redirect(url);
        } else {
            res.status(404).json({
                msg: `${slug} not found!`
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Link not found!'
        });
    }
})

app.post('/url', async (req, res, next) => {
    let { slug, url } = req.body
    try {
        await schema.validate({
            slug,
            url
        })
        if (!slug) {
            slug = nanoid(5);
        } else {
            const existing = await urls.findOne({ slug });
            if (existing) {
                throw new Error('Slug in use!!');
            }
        }
        slug = slug.toLowerCase();
        const newUrl = {
            slug,
            url
        }
        const created = await urls.insert(newUrl);
        res.json(created);
    } catch (error) {
        if (error.message.startsWith('E11000')) {
            res.json({
                msg: 'Slug in use already!'
            })
        }
        next(error);
    }
})

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        msg: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🔥' : error.stack
    })
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`running on port: ${port}`);
})


