// Last updated: 2018-11-27 16:00:42
const storeImages = [
    {
        name: "Times Square Rain Street.jpg",
        url: "../../media/store/Times%20Square%20Rain%20Street.jpg",
    },
    {
        name: "Lombard Street Drone.jpg",
        url: "../../media/store/Lombard%20Street%20Drone.jpg",
    },
    {
        name: "Larry Bao Two Man Boat Portrait.jpg",
        url: "../../media/store/Larry%20Bao%20Two%20Man%20Boat%20Portrait.jpg",
    },
    {
        name: "Mori Point Pacifica Long Exposure Rocks.jpg",
        url: "../../media/store/Mori%20Point%20Pacifica%20Long%20Exposure%20Rocks.jpg",
    },
    {
        name: "Fall Tree Lens Ball.jpg",
        url: "../../media/store/Fall%20Tree%20Lens%20Ball.jpg",
    },
    {
        name: "Grand Teton Landscape.jpg",
        url: "../../media/store/Grand%20Teton%20Landscape.jpg",
    },
    {
        name: "Roxelana Jewels Lamps.jpg",
        url: "../../media/store/Roxelana%20Jewels%20Lamps.jpg",
    },
    {
        name: "Bear Valley Astrophotography (Horizontal).jpg",
        url: "../../media/store/Bear%20Valley%20Astrophotography%20%28Horizontal%29.jpg",
    },
    {
        name: "Minnesota Drone.jpg",
        url: "../../media/store/Minnesota%20Drone.jpg",
    },
    {
        name: "Bear Valley Astro Portrait.jpg",
        url: "../../media/store/Bear%20Valley%20Astro%20Portrait.jpg",
    },
    {
        name: "Princeton Football Field At Night.jpg",
        url: "../../media/store/Princeton%20Football%20Field%20At%20Night.jpg",
    },
    {
        name: "Santa Cruz Boardwalk Drone (Top Down).jpg",
        url: "../../media/store/Santa%20Cruz%20Boardwalk%20Drone%20%28Top%20Down%29.jpg",
    },
    {
        name: "Times Square Santa.jpg",
        url: "../../media/store/Times%20Square%20Santa.jpg",
    },
    {
        name: "Artisan Dinner Table.jpg",
        url: "../../media/store/Artisan%20Dinner%20Table.jpg",
    },
    {
        name: "Times Square Taxi (Behind).jpg",
        url: "../../media/store/Times%20Square%20Taxi%20%28Behind%29.jpg",
    },
    {
        name: "1903 Hall Drone Top Down.jpg",
        url: "../../media/store/1903%20Hall%20Drone%20Top%20Down.jpg",
    },
    {
        name: "Times Square Taxi (Side).jpg",
        url: "../../media/store/Times%20Square%20Taxi%20%28Side%29.jpg",
    },
    {
        name: "Golden Gate Bridge Night (Marin Headlands).jpg",
        url: "../../media/store/Golden%20Gate%20Bridge%20Night%20%28Marin%20Headlands%29.jpg",
    },
    {
        name: "Bear Valley Astrophotography (Portrait).jpg",
        url: "../../media/store/Bear%20Valley%20Astrophotography%20%28Portrait%29.jpg",
    },
    {
        name: "Loneliest Road Mountain.jpg",
        url: "../../media/store/Loneliest%20Road%20Mountain.jpg",
    },
    {
        name: "THS Tennis Court Drone (Drone Art).jpg",
        url: "../../media/store/THS%20Tennis%20Court%20Drone%20%28Drone%20Art%29.jpg",
    },
    {
        name: "Cliff House Sutro Baths at Night.jpg",
        url: "../../media/store/Cliff%20House%20Sutro%20Baths%20at%20Night.jpg",
    },
    {
        name: "Loneliest Road Drone.jpg",
        url: "../../media/store/Loneliest%20Road%20Drone.jpg",
    },
    {
        name: "Clean Trahs Philly.jpg",
        url: "../../media/store/Clean%20Trahs%20Philly.jpg",
    },
    {
        name: "Loneliest Road (Vanishing Road).jpg",
        url: "../../media/store/Loneliest%20Road%20%28Vanishing%20Road%29.jpg",
    },
    {
        name: "HanaHaus Coffee.jpg",
        url: "../../media/store/HanaHaus%20Coffee.jpg",
    },
    {
        name: "Delta Lake.jpg",
        url: "../../media/store/Delta%20Lake.jpg",
    },
    {
        name: "New York Street Artist (Side).jpg",
        url: "../../media/store/New%20York%20Street%20Artist%20%28Side%29.jpg",
    },
    {
        name: "Jackson Hole Golf Course Drone.jpg",
        url: "../../media/store/Jackson%20Hole%20Golf%20Course%20Drone.jpg",
    },
    {
        name: "Burning Paper.jpg",
        url: "../../media/store/Burning%20Paper.jpg",
    },
    {
        name: "Jackson Golf Trevor Fishing.jpg",
        url: "../../media/store/Jackson%20Golf%20Trevor%20Fishing.jpg",
    },
    {
        name: "Patton Hall Drone.jpg",
        url: "../../media/store/Patton%20Hall%20Drone.jpg",
    },
    {
        name: "Top of the Rock Sign.jpg",
        url: "../../media/store/Top%20of%20the%20Rock%20Sign.jpg",
    },
    {
        name: "Time Square Taxi.jpg",
        url: "../../media/store/Time%20Square%20Taxi.jpg",
    },
    {
        name: "Grand Teton Astro with Grass.jpg",
        url: "../../media/store/Grand%20Teton%20Astro%20with%20Grass.jpg",
    },
    {
        name: "San Francisco from Russian Hill Drone.jpg",
        url: "../../media/store/San%20Francisco%20from%20Russian%20Hill%20Drone.jpg",
    },
    {
        name: "Christmas Ornament.jpg",
        url: "../../media/store/Christmas%20Ornament.jpg",
    },
    {
        name: "THS Tennis Court Drone (Top Down).jpg",
        url: "../../media/store/THS%20Tennis%20Court%20Drone%20%28Top%20Down%29.jpg",
    },
    {
        name: "Grand Teton Landscape (2x3).jpg",
        url: "../../media/store/Grand%20Teton%20Landscape%20%282x3%29.jpg",
    },
    {
        name: "Loneliest Road Drone (Top Down).jpg",
        url: "../../media/store/Loneliest%20Road%20Drone%20%28Top%20Down%29.jpg",
    },
    {
        name: "Fly Fishing Rod.jpg",
        url: "../../media/store/Fly%20Fishing%20Rod.jpg",
    },
    {
        name: "Princeton Football Field (Down).jpg",
        url: "../../media/store/Princeton%20Football%20Field%20%28Down%29.jpg",
    },
    {
        name: "New York Street Artist (Front).jpg",
        url: "../../media/store/New%20York%20Street%20Artist%20%28Front%29.jpg",
    },
    {
        name: "Times Square Lens Ball.jpg",
        url: "../../media/store/Times%20Square%20Lens%20Ball.jpg",
    },
    {
        name: "Dog Sledding Dog.jpg",
        url: "../../media/store/Dog%20Sledding%20Dog.jpg",
    },
    {
        name: "Piano Black and White.jpg",
        url: "../../media/store/Piano%20Black%20and%20White.jpg",
    },
    {
        name: "Larry Bao Two Man Boat Top Down.jpg",
        url: "../../media/store/Larry%20Bao%20Two%20Man%20Boat%20Top%20Down.jpg",
    },
    {
        name: "Lake Carnegie Landscape Fall Season.jpg",
        url: "../../media/store/Lake%20Carnegie%20Landscape%20Fall%20Season.jpg",
    },
    {
        name: "Delta Lake Glacier Runnoff.jpg",
        url: "../../media/store/Delta%20Lake%20Glacier%20Runnoff.jpg",
    },
    {
        name: "Mori Point Pacifica Sunset.jpg",
        url: "../../media/store/Mori%20Point%20Pacifica%20Sunset.jpg",
    },
    {
        name: "Yin Yang Golden Gate Bridge Light Painting.jpg",
        url: "../../media/store/Yin%20Yang%20Golden%20Gate%20Bridge%20Light%20Painting.jpg",
    },
    {
        name: "1903 Hall and Cuyler Hall Drone.jpg",
        url: "../../media/store/1903%20Hall%20and%20Cuyler%20Hall%20Drone.jpg",
    },
    {
        name: "Princeton Boat House Fall Season.jpg",
        url: "../../media/store/Princeton%20Boat%20House%20Fall%20Season.jpg",
    },
    {
        name: "Grand Teton Bison.jpg",
        url: "../../media/store/Grand%20Teton%20Bison.jpg",
    },
    {
        name: "Teddy Niagara Falls.jpg",
        url: "../../media/store/Teddy%20Niagara%20Falls.jpg",
    },
    {
        name: "Devil's Tower.jpg",
        url: "../../media/store/Devil%27s%20Tower.jpg",
    },
    {
        name: "KHou Golden Gate Bridge Light Painting.jpg",
        url: "../../media/store/KHou%20Golden%20Gate%20Bridge%20Light%20Painting.jpg",
    },
    {
        name: "Badlands 1.jpg",
        url: "../../media/store/Badlands%201.jpg",
    },
    {
        name: "Rubicon Peak (Drone).jpg",
        url: "../../media/store/Rubicon%20Peak%20%28Drone%29.jpg",
    },
    {
        name: "Palace of Fine Arts Street with Cars Drone.jpg",
        url: "../../media/store/Palace%20of%20Fine%20Arts%20Street%20with%20Cars%20Drone.jpg",
    },
    {
        name: "Times Square Screens.jpg",
        url: "../../media/store/Times%20Square%20Screens.jpg",
    },
    {
        name: "Mount Rushmore (Picture of iPhone).jpg",
        url: "../../media/store/Mount%20Rushmore%20%28Picture%20of%20iPhone%29.jpg",
    },
    {
        name: "Badlands 2.jpg",
        url: "../../media/store/Badlands%202.jpg",
    },
    {
        name: "Grand Teton Morman Row.jpg",
        url: "../../media/store/Grand%20Teton%20Morman%20Row.jpg",
    },
    {
        name: "Times Square Long Exposure Cars.jpg",
        url: "../../media/store/Times%20Square%20Long%20Exposure%20Cars.jpg",
    },
    {
        name: "1903 Hall in Snow.jpg",
        url: "../../media/store/1903%20Hall%20in%20Snow.jpg",
    },
    {
        name: "Sea Ranch Seals Drone (Top Down).jpg",
        url: "../../media/store/Sea%20Ranch%20Seals%20Drone%20%28Top%20Down%29.jpg",
    },
];