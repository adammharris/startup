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

Three issues I haven't quite figured out yet:
- How will login work? How use a browser cookie, dynamically update each page's navigation to place 'login' with 'dashboard'?
- How will posts work? I experimented with using zero-md and YAML frontmatter, but I don't know if that will be the best solution.
- How will comments work? The placeholder is an `iframe`, but I don't know if that is the best way to do it.

There has been a bit of regression when I implemented my website in Vite. It is not as colorful, and the dashboard is missing. But I think for now it is sufficient— I'll have to review the best way to implement it using React, since I basically had to build the whole website from scratch again after the transition.