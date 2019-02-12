
const parse = async (event) => {
  const command = event.text.split(' ')[0]
  let parameters = stripCommand(event.text)

  switch (command) {
    case 'new':
      return parseNew(parameters)
    case 'current':
      return parseCurrent(parameters, event.channel_id)
    case 'addPlayers':
      return parsePlayers(parameters, event.channel_id)
    default:
      return { type: 'help', data: { responseURL: event.response_url } }
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const parsePlayers = (parameters, channelID) => {
  return { type: 'addPlayers', data: { players: parameters, channelID } }
}

const parseCurrent = (parameters, channelID) => {
  try {
    return { type: 'current', data: { tournamentName: parameters[0], channelID } }
  } catch (err) {
    return { error: 'current command invalid' }
  }
}

const parseNew = (parameters) => {
  let tournaName = null
  let rounds = null
  try {
    tournaName = parameters[0]
    const roundsIndex = parameters.findIndex(param => param === 'rounds')
    if (roundsIndex === -1) return { error: 'rounds not found or too small' }
    rounds = parameters[roundsIndex - 1]

    if (!isNormalInteger(rounds) || rounds < 3) return { error: 'rounds not found or too small' }
    if (!/\S/.test(tournaName)) return { error: 'name not found' }
  } catch (err) {
    return { error: 'new command invalid' }
  }
  return { type: 'newTournament', data: { tournaName, rounds } }
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

module.exports = { parse }