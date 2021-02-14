export default `<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="utf-8"/>
  <title>Test</title>
<style>
  * {
  margin: 0;
  padding: 0;
  font-size: 7px !important;
}

  .pb-before {
  page-break-before: always !important;
}

  .page {
  padding: 10px;
}

  .text-align-right {
  text-align: right;
}

  .text-align-left {
  text-align: left;
}

  hr {
  height: 0.14em;
  border: none;
  color: black;
  background-color: black;
  margin: 4px 0;
}

  .items {
  list-style-type: none;
  position: relative;
}

  .properties {
  padding-left: 14px !important;
}

  .quantity {
  position: absolute;
  right: 0;
  top: 0;
}

  .header-item-right {
  position: absolute;
  top: 0;
  right: 0;
}

  .header-item-left {
  position: sticky;
  top: 0;
  left: 0;
}

  .header {
  position: relative;
  width: 100%;
}
</style>
</head>
<body>
{{#each this}}
<div class="page">
<div class="header">
<div class="header-item-right">
<p class="text-align-right">
Order: {{order}}
</p>
<p class="text-align-right">
{{createdAt}}
</p>
</div>

{{#with address}}
<div class="header-item-left">
<p class="text-align-left">
{{first_name}} {{last_name}}
</p>
<p class="text-align-left">
{{zip}}
</p>
</div>
{{/with}}
</div>
<hr/>

<ul class="items">
{{#each items}}
<li>{{title}}</li>
<li>{{variant}}</li>
<p class="quantity">{{quantity}} pcs</p>
<ul class="properties">
{{#each properties}}
<li>{{name}}: {{value}}</li>

{{/each}}
</ul>
<br>
{{/each}}
</ul>
<hr/>
{{note}}
</div>
{{#unless @last}}
<div class="pb-before"></div>
{{/unless}}
{{/each}}
</body>
</html>`;
