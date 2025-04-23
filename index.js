import ssocks from 'socksv5'
import cron from 'node-cron'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const cronTimeout = process.env.CRON_TIMEOUT || 5 
const port = process.env.PORT || 1080
const URL = process.env.URL
if (!URL) throw new Error('Missing URL in env')

const makeAvailable = async () => {
  try {
    const response = await fetch(URL, { method: 'POST' })
    const data = await response.json()
    console.log('Heartbeat sent:', data)
  } catch (err) {
    console.error('Error sending heartbeat:', err.message)
  }
};

makeAvailable();

cron.schedule(`*/${cronTimeout} * * * * *`, async () => {
  makeAvailable();
});

const server = ssocks.createServer((info, accept, deny) => {
  console.log(`New conn: ${info.dstAddr}:${info.dstPort}`)
  const socket = accept(true)
})

server.listen(port, '0.0.0.0', () => {
  console.log('SOCKS5 proxy escuchando en puerto 1080')
})
