const sass = require('sass');
const fs = require('fs-extra');
const path = require('path');

const processSass = (scssPath, cssPath) => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'prod') {
        console.log('Processing scss files for prod mode');
        const result = sass.renderSync({
            file: scssPath,
            outputStyle: 'compressed'
        });
        fs.mkdirpSync(path.dirname(cssPath), { recursive: true });
        fs.writeFileSync(cssPath, result.css.toString());
    } else {
        console.log('Processing scss files for dev mode: ', scssPath);
        //If cssPath directory doesn't exist...
        //Encapsulate rendered css from scssPath into result variable
        const result = sass.renderSync({
            file: scssPath
        });
        if (!fs.existsSync(path.dirname(cssPath))) {
            //Create cssPath directory recursively
            fs.mkdirp(path.dirname(cssPath), { recursive: true })
                //Then write result css string to cssPath file
                .then(() => fs.writeFile(cssPath, result.css.toString()))
                .catch(error => console.error(error));
        } else {
            fs.writeFile(cssPath, result.css.toString());
        }
        //Watch for changes to scssPath directory...
        fs.watch(path.dirname(scssPath), () => {
            console.log(`Watching scss directory ${path.dirname(scssPath)}...`);
            //Encapsulate rendered css from scssPath into watchResult variable
            const watchResult = sass.renderSync({
                file: scssPath,
                outputStyle: 'compressed'
            });
            //Then write result css string to cssPath file
            fs.writeFile(cssPath, watchResult.css.toString()).catch(error =>
                console.error(error)
            );
        });
    }
};

processSass('./src/index.scss', './dist/styles/index.css');
