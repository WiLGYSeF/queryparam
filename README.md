# QueryParam

A simple library for handling URL query parameters in links.

Making links that contain query parameters are annoying if you just want to change one parameter when clicking on it.

## Examples

In order for these link fragments to be converted, you must use this after the anchor elements have been added to the document:
`QueryParam.convertHrefs()`

Starting from the page url `/mypagelist`:

#### Having a link to visit page of results:
```html
<a href="##+page=3##">Page 3</a>
```
Will link to: `/mypagelist?page=3`

#### Adding a sort parameter:
```html
<a href="##+sort=title##">Sort by title</a>
```
Will link to: `/mypagelist?page=3&sort=title`

#### Link to the next page:
```html
<a href="##+=page##">Next Page</a>
```
Will link to: `/mypagelist?page=4&sort=title`

#### Using filters:
```html
<a href="##+$filter=apple##">Filter apples</a>
```
Will link to: `/mypagelist?page=4&sort=title&filter=apple`

```html
<a href="##+$filter=banana##">Filter bananas</a>
```
Will link to: `/mypagelist?page=4&sort=title&filter=apple&filter=banana`

#### Removing the sort parameter:
```html
<a href="##-sort##">Default sorting</a>
```
Will link to: `/mypagelist?page=4&filter=apple&filter=banana`

## Usage

Hrefs that are converted with `QueryParam.convertHrefs()` take this format:
```
##<modify mode><key>[=<value>]##
```

| Modify Modes | Description | Value Required |
|:-:|---|---|
| `+` | add parameter, overwrite value if it exists | required |
| `+^` | add parameter to the beginning even if it exists | required |
| `+$` | add parameter to the end even if it already exists | required |
| `+=` | increment parameter, value is increment step (default 1) | optional |
| `-` | remove all parameters with specified key | unused |
| `-^` | remove first parameter with specified key | unused |
| `-$` | remove last parameter with specified key | unused |
| `-=` | decrement parameter, value is decrement step (default 1) | optional |
| `=` | set parameter to value only if it exists | required |
| `=^` | keep only first parameter with specified key | unused |
| `=$` | keep only last parameter with specified key | unused |
