const chalk  = require('chalk');
const layout = require('../layout');

module.exports = ({ products }) => {
    console.log(chalk.yellow('DEBUG: index.js: products: '));
    const renderedProducts = products
    .map(product => {
      return `
      <tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
          <!-- <a href="/admin/products/edit"> -->
          <a href="/admin/products/edit/${product.id}"> 
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
          <form method="POST" action="/admin/products/delete/${product.id}">
            <button class="button is-danger">Delete</button>
          </form>
        </td>
      </tr>
    `;
    })
    .join('');

  return layout({
    content: `
      <div class="control">
        <h1 class="subtitle">Products</h1>  
        <a href="/admin/products/new" class="button is-primary">New Product</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedProducts}
        </tbody>
      </table>
    `
  });
};
