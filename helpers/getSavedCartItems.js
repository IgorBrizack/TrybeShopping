const getSavedCartItems = () => {
  // seu código aqui
  const localStorageItems = localStorage.getItem('cartItems');
  return localStorageItems;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}