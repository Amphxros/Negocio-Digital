class BlogList {
    constructor(cart) {
      this.cart = cart;
      this.container = document.querySelector('.blog-container');
      this.productService = new BlogService();
      this.sortDirection = 'ascending';
      this.productService
        .getBlog()
        .then(() => this.renderBlog())
        .then(() => this.addEventListeners()); 
      document.querySelector('.search').addEventListener('keydown', async () => {
        await this.renderBlog();
        this.addEventListeners();
      });   
    }
    async renderBlog() {
      const searchInput = document.querySelector('.search');
      let productListDomString = '';
      const products = await this.productService.getBlog();
      [...products]
        .filter( product => product.title.includes(searchInput.value) )
        .sort( (a, b) => this.sortDirection === 'ascending' 
                           ? a.id - b.id
                           : b.id - a.id)
        .forEach(product => {
        productListDomString += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                    <div class="card product">
                     
                      <div class="card-body d-flex flex-column">
                        <h4 class="card-title">${product.title}</h4>
                        <p class="card-text flex-fill">${product.description}</p>
                        <img class="card-img-top" src="${product.image}" 
                        alt="${product.title}">
                        <div class="d-flex justify-content-around">
                          <button class="btn btn-info" data-bs-toggle="modal"
                            data-bs-target="#productInfoModal" data-id="${product.id}">Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>`;
      });
      this.container.innerHTML = productListDomString;
    }
    async addEventListeners() {
      document
        .querySelectorAll('.product .btn-info')
        .forEach(button =>
          button.addEventListener('click', event =>
            this.handleProductInfoClick(event)
          )
        );
      document
        .querySelectorAll(
          '.card.product button.buy, #productInfoModal button.buy'
        )
        .forEach(button =>
          button.addEventListener('click', event =>
            this.handleProductBuyClick(event)
          )
        );
      document.querySelector('.sort-asc').addEventListener('click', async () => {
          this.sortDirection = 'ascending';
          await this.renderProducts();
          this.addEventListeners();
      });
      document.querySelector('.sort-desc').addEventListener('click', async () => {
          this.sortDirection = 'descending';
          await this.renderProducts();
          this.addEventListeners();
      });
    }
    async handleProductInfoClick(event) {
      const button = event.target; // Button that triggered the modal
      const id = button.dataset.id; // Extract info from data-* attributes
      const product = await this.productService.getBlogById(id);
      const modal = document.querySelector('#productInfoModal');
      
      modal.querySelector('.modal-body .card-title').innerText = product.title;
    modal.querySelector('.modal-body .card-text').innerText =
        product.description + "\n \n" + product.content;
    }
    handleProductBuyClick(event) {
      const button = event.target;
      const id = button.dataset.id;
      this.cart.addProduct(id);
      window.showAlert('Product added to cart');
    }
  }
  