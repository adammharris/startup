# CS 260 Notes

[My startup](https://showbrain.net)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS Notes

I have my AWS server running now with HTTPS!

Route 53 allows rerouting to servers in EC2

Caddy automatically turns HTTP to HTTPS, without having to get a cerificate manually

## Todo

- Allow visiting another's site
	- URI scheme like `showbrain.net/{username}`
	- Conditionally hide or show elements depending on if authtoken is present
		- Consider whether to implement this as a single `dashboard` component or as two separate components, perhaps a `dashboard` and a `blog`
- Allow comments to appear instantaneously via websockets

## Future plans

- Import/export articles in Markdown
    - Add support for various formats via `pandoc`?
    - Store article data internally as a Markdown file? Store metadata internally as YAML frontmatter?

There has been a bit of regression when I implemented my website in Vite. It is not as colorful, and the dashboard is missing. But I think for now it is sufficient— I'll have to review the best way to implement it using React, since I basically had to build the whole website from scratch again after the transition.