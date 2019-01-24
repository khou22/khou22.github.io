var App = React.createClass({ //Main parent component
    render: function() {
        return (
            <div>
                <h1>Syntax Highlighter</h1>
                    <pre><code class="language-java">
                        console.log("hello, world");
                    </code></pre>
            </div>
        );
    }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
