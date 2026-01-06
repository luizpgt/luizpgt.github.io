const DRIVE = "https://script.google.com/macros/s/AKfycbz5XBD1-l3JMwGuE9JtlZyRdDMrBBnG_A_Lf7dBupv4ypxMDIorBc0AYLIQIKVlwcfS/exec";

// get all party 
async function party() {

    // show the input section and hide the result section
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';

    try {
        const response = await fetch(DRIVE, { method: "GET" })
        const data = await response.json()
        party = data.files

        const container = document.getElementById('badge-container');
        party.forEach(member => {
            const div = document.createElement('div');
            div.className = 'badge';
            div.textContent = member;

            div.onclick = () => {
                giftee(member)
                console.log("chamando giftee para:", member);
            };

            container.appendChild(div);
        });
    } catch (error) {
        console.error("Não foi: ", error)
    }
}

async function giftee(member) {

    // hide the input section and show the result section
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';

    try {
        const response = await fetch(DRIVE, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: member,
        })

        const result = await response.json();
        console.log(result)

        // print result
        const container = document.getElementById('badge-container-res');
        const div = document.createElement('div');
        div.className = 'badge';
        div.textContent = result.giftee;
        container.appendChild(div);

        // console.log("Foi");
    } catch (error) {
        console.log("Não foi: ", error);
    }
}