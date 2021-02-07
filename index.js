const { text } = require('input')
const rpc = require('discord-rpc')
const client = new rpc.Client({ transport: 'ipc' })

const ask = async (_text) => {
    const ans = await text(_text, { default: undefined });
    return ans
}

const askID = async () => {
    var ID = await ask("ID of your Discord Application: ")
    ID = ID.replace(/\s/g, "")
    if (!ID) {
        console.log("You must specify the ID of your Discord Application ! Exiting...");
        process.exit(1)
    }
    if (!ID.match(/^[0-9]{18}$/g)) {
        console.log("Invalid Application ID given ! Exiting...");
        process.exit(1)
    }
    return ID
}

const getButtons = async () => {
    var buttons = []

    var button1 = {}
    var button2 = {}

    const button1_label = await ask("Button 1 text (press enter to skip): ")
    if (!button1_label) return null
    var button1_link = await ask('Button 1 link: ')

    button1.label = button1_label
    button1.url = button1_link
    buttons.push(button1)

    var button2_label = await ask("Button 2 text (press enter to skip): ")
    if (!button2_label) return buttons
    var button2_link = await ask('Button 2 link: ')

    button2.label = button2_label
    button2.url = button2_link
    buttons.push(button2)

    return buttons
}
const main = async () => {

    console.log("\33[93mDiscord Custom Status By \33[94mSkwal.net \33[0m");
    const ID = await askID()
    const details = await ask("Details: ")
    if (!details) {
        console.log("You must specify something ! Exiting...");
        process.exit(1)
    }
    const large_image = await ask("Large image name (optionnal): ") || "Skwal"
    const small_image = await ask("Small image name (optionnal): ") || "Skwal"
    const buttons = await getButtons()
    client.on('ready', () => {
        buttons ? client.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: details,
                assets: {
                    large_image: large_image,
                    small_image: small_image,
                    small_text: "https://skwal.net",
                    large_text: "Discord Custom Status Created by Skwal, https://skwal.net"

                },
                buttons: buttons
            }
        }).catch(e => {
            if (e.data.message.includes('valid uri')) {
                console.log('Invalid button url given! Exiting....');
                process.exit(1)
            }

        }) : client.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: details,
                assets: {
                    large_image: large_image,
                    small_image: small_image,
                    small_text: "https://skwal.net",
                    large_text: "Discord Custom Status Created by Skwal, https://skwal.net"

                }
            }
        })
        console.log('Authed for user:', client.user.username);
    })
    client.login({ clientId: ID }).catch(e => {
        if (e.message.includes('Could not connect')) {
            console.log('Unable to connect! Please restart your discord Application');
            process.exit(1)
        }
        console.error("Invalid Discord Application ID given!"); process.exit(1)
    });

}

main()