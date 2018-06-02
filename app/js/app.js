import view from './view.js'

async function main() {
    const req = await fetch('data/data.json');
    const data = await req.json();
    window.__view__ = view(data);
}

main();