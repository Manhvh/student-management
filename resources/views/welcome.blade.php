<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" value="{{ csrf_token() }}">
        <link href="{{ mix('assets/styles/app.css') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app">
            <example-component></example-component>
        </div>

        <script src="{{ mix('assets/scripts/app.js') }}"></script>
    </body>
</html>
