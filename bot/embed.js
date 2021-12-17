/**
 * Create message embed
 * @param {String} title 
 * @param {String} color 
 * @param {String} description 
* @returns {Discord.MessageEmbed} Object
 */
function getEmbed(color, description, title = '') {
    const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
    return embed;
}

module.exports = {
    getEmbed
}