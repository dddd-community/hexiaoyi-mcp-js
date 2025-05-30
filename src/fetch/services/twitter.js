const { HttpsProxyAgent } = require('https-proxy-agent');
const {TwitterApi} = require("twitter-api-v2");
const {logger} = require("../../utils/logger");

let client;
let clientBearer;

const httpAgent = new HttpsProxyAgent(process.env.HTTP_PROXY_URL)

if(process.env.TWITTER_APP_KEY) {
    client = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    }, {httpAgent:httpAgent});

    clientBearer = new TwitterApi(process.env.TWITTER_BEARER);
}

const searchHotsTweets = async (key, len = 20) => {
    try {

        const cappedMaxResults = Math.min(Math.max(len, 1), 100);

        // 使用 client.v2.search 搜索推文
        const searchResults = await client.v2.search(key, {
            'max_results': cappedMaxResults,
            'tweet.fields': 'public_metrics,created_at', // 获取点赞数、转发数、创建时间
        });

        // 收集所有推文
        const tweets = [];
        for await (const tweet of searchResults) {
            tweets.push({
                id:tweet.id,
                tweet:tweet.text
            });
            if (tweets.length >= cappedMaxResults) {
                break;
            }
        }
        // 输出热门推文
        /*tweets.forEach((tweet, index) => {
            console.log(`热门推文 ${index + 1}:`);
            console.log(`内容: ${tweet.text}`);
            console.log(`点赞数: ${tweet.public_metrics.like_count}`);
            console.log(`转发数: ${tweet.public_metrics.retweet_count}`);
            console.log(`创建时间: ${tweet.created_at}`);
            console.log('---');
        });*/
        console.log("tweets", tweets)
        return tweets;
    } catch (e) {
        console.error("searchHotsTweets error", e);
        return [];
    }
}

module.exports = {searchHotsTweets}