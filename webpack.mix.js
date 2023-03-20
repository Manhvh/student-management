const {
    exec
} = require('child_process');
const fs = require('fs');
const glob = require('glob');
const mix = require('laravel-mix');
const path = require('path');

function resolve(dir) {
    return path.resolve(__dirname, dir);
}

// Remove file old
const removeAllFile = function (dir) {
    let list = fs.readdirSync(dir);
    let skipFile = ['.', '..', '.gitignore'];

    for (let i = 0; i < list.length; i++) {
        let filename = path.join(dir, list[i]);
        let basename = path.basename(filename);
        let stat = fs.statSync(filename);

        if (skipFile.indexOf(basename) === -1) {
            if (stat.isDirectory()) {
                removeAllFile(filename);
            } else {
                fs.unlinkSync(filename);
            }
        }
    }
};

let resourcePath = 'resources/assets/';
let jsResourcePath = resourcePath + 'src/';
let stylesWebPath = 'assets/styles';
let scriptsWebPath = 'assets/scripts';
let webfontsPath = 'public/assets/webfonts';
let imagesWebPath = 'public/assets/images';
const multipleSelect = 'public/assets/scripts';
const suggestionPath = 'public/assets/suggestion';
const tinymcePath = 'public/assets/tinymce';

const entries = require('./resources/assets/src/entries/dispatcher.js');

mix.options({
    processCssUrls: false // Process/optimize relative stylesheet url()'s.
}).webpackConfig({
    entry: entries,
    resolve: {
        alias: {
            sass: resolve('assets/sass'),
            components: resolve(jsResourcePath + 'components'),
            config: resolve(jsResourcePath + 'config'),
            directives: resolve(jsResourcePath + 'directives'),
            domain: resolve(jsResourcePath + 'domain'),
            infrastructures: resolve(jsResourcePath + 'infrastructures'),
            mixins: resolve(jsResourcePath + 'mixins'),
            plugins: resolve(jsResourcePath + 'plugins'),
        },
    },
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            cacheGroups: {
                lodash: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]((lodash).*)[\\/]/,
                    name: "assets/scripts/lodash",
                    minChunks: 1,
                },
                axios: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]((axios).*)[\\/]/,
                    name: "assets/scripts/axios",
                    minChunks: 1,
                },
                moment: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]((moment).*)[\\/]/,
                    name: "assets/scripts/moment",
                    minChunks: 1,
                },
                jquery: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]((jquery).*)[\\/]/,
                    name: "assets/scripts/jquery",
                    minChunks: 1,
                }
            }
        }
    },
});

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

// Remove old version
removeAllFile(__dirname + '/' + imagesWebPath);
removeAllFile(__dirname + '/public/' + stylesWebPath);
removeAllFile(__dirname + '/public/' + scriptsWebPath);
removeAllFile(__dirname + '/' + webfontsPath);

mix.setPublicPath('public')
    .vue()
    .sass(resourcePath + 'sass/app.scss', stylesWebPath)
    .js(resourcePath + 'src/app.js', scriptsWebPath)
    .js('node_modules/bootstrap', scriptsWebPath)
    .copy(resourcePath + 'images', imagesWebPath);

// CSS for single page use
(glob.sync(resourcePath + 'sass/pages/!(_)*.scss') || []).forEach(file => {

    let fileName = path.basename(file.replace(/\.scss$/, '.css'));
    mix.sass(file, stylesWebPath + '/pages/' + fileName);
});
(glob.sync(resourcePath + 'sass/pages/admin/!(_)*.scss') || []).forEach(file => {

    let fileName = path.basename(file.replace(/\.scss$/, '.css'));
    mix.sass(file, stylesWebPath + '/pages/admin/' + fileName);
});
(glob.sync(resourcePath + 'sass/pages/user/!(_)*.scss') || []).forEach(file => {

    let fileName = path.basename(file.replace(/\.scss$/, '.css'));
    mix.sass(file, stylesWebPath + '/pages/user/' + fileName);
});

// Copy Fontawesome webfonts
mix.copy('node_modules/@fortawesome/fontawesome-free/js/all.js', 'public/' + scriptsWebPath + '/fontawesome');
mix.copyDirectory('node_modules/@fortawesome/fontawesome-free/webfonts', webfontsPath);
mix.copyDirectory('node_modules/vue-multiselect/dist/vue-multiselect.min.css', multipleSelect);
mix.copyDirectory('node_modules/vue-simple-suggest/dist/styles.css', suggestionPath);
mix.copyDirectory('node_modules/tinymce', tinymcePath);

// Generate language file for javascript
mix.then(() => {
    exec('php artisan language:generate');
});

if (mix.inProduction()) {
    mix.version();
} else {
    mix.webpackConfig({
        devtool: 'inline-source-map'
    }).sourceMaps();
}
