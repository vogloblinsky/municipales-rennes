var compress_images = require('compress-images'),
    INPUT_path_to_your_images,
    OUTPUT_path;

INPUT_path_to_your_images = 'dist/assets/**/*.{jpg,JPG,jpeg,JPEG,png}';
OUTPUT_path = 'dist2/assets/';

compress_images(
    INPUT_path_to_your_images,
    OUTPUT_path,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '90'] } },
    { png: { engine: 'pngquant', command: ['--quality=40-70'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    {
        gif: {
            engine: 'gifsicle',
            command: ['--colors', '64', '--use-col=web']
        }
    },
    function(error, completed, statistic) {
        console.log('-------------');
        /*console.log(error);
        console.log(completed);
        console.log(statistic);*/
        console.log('-------------');
    }
);
