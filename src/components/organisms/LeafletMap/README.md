# LeafletMap

An interactive [Leaflet](https://leafletjs.com/) map for blog posts. Renders
pins with fully customizable markers: **emoji**, a **colored dot**, a **text
label**, or a **built-in vector icon**. Each pin can show a hover tooltip and a
click popup.

It is client-only (Leaflet needs `window`), so it is loaded through a
`next/dynamic` wrapper with `ssr: false`. Blog posts are rendered with
`react-markdown` + `rehype-raw` (not true MDX), so the map is embedded via a
custom `<leaflet-map>` HTML tag whose config is passed as attributes.

## Embedding in a blog post (`.md` / `.mdx`)

```html
<leaflet-map
  height="420"
  center="40.7128,-74.0060"
  zoom="11"
  pins='[
    {"lat":40.7484,"lng":-73.9857,"label":"Empire State","icon":{"type":"emoji","value":"🏙️"},"popup":"<b>Empire State Building</b><br/>350 5th Ave"},
    {"lat":40.6892,"lng":-74.0445,"label":"Statue of Liberty","icon":{"type":"emoji","value":"🗽"}},
    {"lat":40.7580,"lng":-73.9855,"label":"Times Square","icon":{"type":"dot","color":"#ef4444"}},
    {"lat":40.7812,"lng":-73.9665,"label":"Central Park","icon":{"type":"icon","name":"star","color":"#16a34a"}},
    {"lat":40.7061,"lng":-73.9969,"label":"My favorite ramen","icon":{"type":"text","value":"🍜 Ramen"}}
  ]'
></leaflet-map>
```

> The `pins` attribute is a JSON string — wrap it in single quotes so the inner
> double quotes stay valid. If `center` is omitted, the map auto-fits to show
> all pins.

### Attributes

| Attribute         | Type                       | Default          | Notes                                            |
| ----------------- | -------------------------- | ---------------- | ------------------------------------------------ |
| `pins`            | JSON array string          | `[]`             | See pin shape below.                             |
| `center`          | `"lat,lng"`                | auto-fit to pins | Initial center.                                  |
| `zoom`            | number                     | `13`             | Ignored when auto-fitting.                       |
| `height`          | number (px) or CSS length  | `400`            | e.g. `"420"` or `"50vh"`.                        |
| `scrollWheelZoom` | `"true"` / `"false"`       | `false`          | Off by default so the page scrolls naturally.    |
| `tileUrl`         | string                     | OpenStreetMap    | Tile layer URL template.                         |
| `attribution`     | string                     | OpenStreetMap    | Tile attribution.                                |

### Pin shape

```jsonc
{
  "lat": 40.7128,        // required
  "lng": -74.006,        // required
  "label": "Tooltip",    // optional hover tooltip
  "popup": "<b>HTML</b>",// optional click popup (trusted HTML or text)
  "icon": { /* see below; defaults to a blue dot */ }
}
```

### Icon types

```jsonc
{ "type": "emoji", "value": "🗽", "size": 28 }
{ "type": "dot",   "color": "#3b82f6", "size": 16 }
{ "type": "text",  "value": "Ramen", "color": "#fff", "background": "#1e293b" }
{ "type": "icon",  "name": "star", "color": "#16a34a", "size": 28 }
```

Built-in `icon` names: `pin`, `star`, `home`, `heart`, `flag`, `camera`,
`food`, `coffee`.

## Using directly in a React component

```tsx
import dynamic from "next/dynamic";

const LeafletMap = dynamic(
  () => import("@/components/organisms/LeafletMap/LeafletMap"),
  { ssr: false },
);

<LeafletMap
  height={400}
  pins={[
    { lat: 35.6762, lng: 139.6503, label: "Tokyo", icon: { type: "emoji", value: "🗼" } },
  ]}
/>;
```
