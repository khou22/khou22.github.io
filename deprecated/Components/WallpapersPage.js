var WallpaperPage = React.createClass({
	getInitialState: function() {
		return {
			fileNames: [
				"iPhone 5s Comet Wallpaper.png",
				"Square Comet Wallpaper.png",
				"iPhone 5s Square Chain Wallpaper.png",
				"Winding Road Wallpaper.png",
				"iPhone 6s Winding Road Wallpaper.png",
				"Skywalker Ranch Glass Wallpaper.png",
				"San Francisco Wallpaper.png",
			]
		}
	},
	render: function() {
		var wallpaperNodes = this.state.fileNames.map(function(slug) {
			var path = "./../../media/design/wallpapers/" + slug;
			return (
				<a href={path} download>
					<img src={path} />
				</a>
			)
		});
		return (
			<div>
				<h1 className="contact-header">Wallpapers</h1>
				<h3>Click on an image to download it</h3>
				{wallpaperNodes}
			</div>
		);
	}
})

React.render(
	React.createElement(WallpaperPage, null),
	document.getElementById('content')
);