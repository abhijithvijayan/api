/* eslint-disable no-console */
import request from 'request';
import cheerio from 'cheerio';
import rp from 'request-promise';
import parseData from '../utils/parseData';
import { setUserRedis, getUserRedis } from '../utils/redis';

const getStudentDetails = async (req, res) => {
    const user = {
        id: req.body.userid,
        password: req.body.password,
    };

    try {
        const data_redis = await getUserRedis(user);
        if (data_redis !== null) {
            console.log('Showing data from redis');
            res.json(data_redis);
            return;
        }
        const data = await getDetailsFromWebsite(user);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(403).send({ status: 'error' });
    }
};

const getCSRFToken = () => {
    const j = request.jar();
    return new Promise((resolve, reject) => {
        const options = {
            uri: 'https://app.ktu.edu.in/login.jsp',
            jar: j,
            transform(body) {
                return cheerio.load(body);
            },
        };
        rp(options)
            .then(function ($) {
                const token = $('input[name="CSRF_TOKEN"]').val();
                resolve({ token, jar: j });
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

const getDetailsFromWebsite = async (user) => {
    const csrf = await getCSRFToken();
    const options = {
        method: 'POST',
        uri: 'https://app.ktu.edu.in/login.jsp',
        simple: false,
        jar: csrf.jar,
        form: {
            CSRF_TOKEN: csrf.token,
            username: user.id,
            password: user.password,
        },
        headers: {
            'user-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0',
            'content-Type': 'application/x-www-form-urlencoded',
        },
        followAllRedirects: true,
        resolveWithFullResponse: true,
    };
    await rp(options);
    const response = await getStudentResponse(csrf.jar);
    const data = parseData(cheerio.load(response), csrf.jar);
    setUserRedis(user, data);
    return data;
};

export const getStudentResponse = (jar) => {
    return new Promise((resolve, reject) => {
        const options = {
            uri: 'https://app.ktu.edu.in/eu/stu/studentDetailsView.htm',
            jar,
        };
        rp(options)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default getStudentDetails;
