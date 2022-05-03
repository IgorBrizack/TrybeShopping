let totalPrice = [];
const pricesElement = document.querySelector('.total-price');
const cartItems = document.getElementsByClassName('cart__items');

const emptyCartItems = () => {
  totalPrice = [];
  pricesElement.innerHTML = 0.00;
  cartItems[0].innerHTML = '';
  localStorage.clear();
};

const clearCartButton = document.querySelector('.empty-cart');
clearCartButton.addEventListener('click', emptyCartItems);

const saveCartValue = (value) => {
  localStorage.setItem('Values', value);
};

const getPriceOfCart = (prices) => {
  if (!prices) pricesElement.innerHTML = 0.00;
  const sumOfPrices = prices.reduce((acc, value) => acc + value, 0);
  pricesElement.innerHTML = sumOfPrices.toFixed(2);
  saveCartValue(pricesElement.innerHTML);
};

const reducePriceOfCart = (prices) => {
  totalPrice = [];
  const atualPriceCart = pricesElement.innerHTML;
  const priceToNumber = Number(atualPriceCart);
  const newValueOfCartPrice = priceToNumber - prices;
  pricesElement.innerHTML = newValueOfCartPrice.toFixed(2);
  saveCartValue(pricesElement.innerHTML);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event, salePrice) {
  localStorage.clear();
  reducePriceOfCart(salePrice);
  event.target.parentNode.remove();
  saveCartItems(cartItems[0].innerHTML);
}

function createCartItemElement({ sku, name, salePrice, image }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const newImg = document.createElement('img');
  newImg.src = image;
  li.appendChild(newImg);
  li.appendChild(createCustomElement('p', 'text')).innerText = `\n ID: ${sku}  
  DADOS: ${name}  
  PREÇO: R$ ${salePrice} 
  \n`;
  li.addEventListener('click', (e) => {
    cartItemClickListener(e, salePrice);
  });
  cartItems[0].appendChild(li);
  saveCartItems(cartItems[0].innerHTML);
  totalPrice.push(salePrice);
  getPriceOfCart(totalPrice);
}

const generateInfosObject = (dataItem) => {
  const infos = {
    sku: dataItem.id,
    name: dataItem.title,
    salePrice: dataItem.price,
    image: dataItem.thumbnail,
  };
  return infos;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCart.addEventListener('click', async () => {
    const dataItem = await fetchItem(sku);
    const infosObject = generateInfosObject(dataItem);
    createCartItemElement(infosObject);
  });
  section.appendChild(addToCart);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const generateObject = (id, nome, imagem) => {
  const object = {
    sku: id,
    name: nome,
    image: imagem,
  };
  return object;
};

const loadingScreenFunction = (condition) => {
  const loadScreenFather = document.querySelector('.items');
  const loadScreen = document.createElement('p');
  loadScreen.className = 'loading';
  loadScreen.innerHTML = 'carregando...';
  if (condition === true) loadScreenFather.appendChild(loadScreen);
  if (condition === false) loadScreenFather.innerHTML = '';
};

const getProducts = async () => {
  loadingScreenFunction(true);
  const data = await fetchProducts('computador');
  if (Object.keys(data).length > 0) loadingScreenFunction(false);
  const product = data.results;
  const productsData = [];
  product.forEach((produto) => productsData.push(generateObject(produto.id,
    produto.title, produto.thumbnail)));
  const itemsElement = document.getElementsByClassName('items');
  return productsData.forEach((products) => {
    itemsElement[0].appendChild(createProductItemElement(products));
  });
};

const loadStorageItems = () => {
  const storageItems = document.querySelectorAll('.cart__item');
  storageItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.innerText.length > 0) {
        const evento = e.target.innerText.split('$')[1];
      cartItemClickListener(e, Number(evento).toFixed(2));
      }
    });
  });
};

const getStorageItems = () => {
  if (cartItems.length > 0) {
    cartItems[0].innerHTML = getSavedCartItems();
  }
};

const verifyStorageValues = () => {
  if (localStorage.getItem('Values') > 0) {
    pricesElement.innerHTML = localStorage.getItem('Values');
  }
};

window.onload = () => {
  getProducts();
  getSavedCartItems();
  getStorageItems();
  loadStorageItems();
  verifyStorageValues();
};
