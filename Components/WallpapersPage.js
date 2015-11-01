var WallpaperPage = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="contact-header">Wallpapers</h1>
        <img src="./../../media/design/wallpapers/iPhone 5s Comet Wallpaper.png" />
        <img src="./../../media/design/wallpapers/Square Comet Wallpaper.png" />
        <img src="./../../media/design/wallpapers/iPhone 5s Square Chain Wallpaper.png" />
      </div>
    );
  }
})

React.render(
  React.createElement(WallpaperPage, null),
  document.getElementById('content')
);