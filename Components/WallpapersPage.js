var WallpaperPage = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="contact-header">Wallpapers</h1>
        <a href="./../../media/design/wallpapers/iPhone 5s Comet Wallpaper.png" download>
			<img src="./../../media/design/wallpapers/iPhone 5s Comet Wallpaper.png" />
		</a>
        <a href="./../../media/design/wallpapers/Square Comet Wallpaper.png" download>
			<img src="./../../media/design/wallpapers/Square Comet Wallpaper.png" />
		</a>
        <a href="./../../media/design/wallpapers/iPhone 5s Square Chain Wallpaper.png" download>
			<img src="./../../media/design/wallpapers/iPhone 5s Square Chain Wallpaper.png" />
		</a>
        <a href="./../../media/design/wallpapers/Winding Road Wallpaper.png" download>
			<img src="./../../media/design/wallpapers/Winding Road Wallpaper.png" />
		</a>
        <a href="./../../media/design/wallpapers/iPhone 6s Winding Road Wallpaper.png" download>
			<img src="./../../media/design/wallpapers/iPhone 6s Winding Road Wallpaper.png" />
		</a>
        <a href="./../../media/design/wallpapers/Skywalker Ranch Glass Wallpaper.png" download>
			<img src="./../../media/design/wallpapers/Skywalker Ranch Glass Wallpaper.png" />
		</a>
      </div>
    );
  }
})

React.render(
  React.createElement(WallpaperPage, null),
  document.getElementById('content')
);