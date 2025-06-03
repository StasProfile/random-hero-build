const App = require('./src/app');

async function main() {
    const app = new App();
    try {
        await app.init();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize the application:', error);
        process.exit(1);
    }
}

main();