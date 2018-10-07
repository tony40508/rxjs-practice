const url = 'https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*';

const getSuggestList = keyword =>
  fetch(url + '&search=' + keyword, { method: 'GET', mode: 'cors' }).then(res =>
    res.json()
  );

const searchInput = document.getElementById('search');
const suggestList = document.getElementById('suggest-list');

// 監聽事件  
const keyword = Rx.Observable.fromEvent(searchInput, 'input');
const selectItem = Rx.Observable.fromEvent(suggestList, 'click');

// 把陣列轉成 li 並寫入 suggestList
const render = (suggestArr = []) => {
  suggestList.innerHTML = 
    suggestArr
      .map(item => `<li> ${ item } </li>`)
      .join('')
};

// 有新的值被輸入後就捨棄前一次發送的，所以這裡用 switchMap
keyword
  .debounceTime(100)
  .switchMap(
    e => getSuggestList(e.target.value),
    (e, res) => res[1]
  )
  .subscribe(list => render(list))


// delegation event 技巧，利用 ul 的 click 事件，來塞選是否 matches 到了 li
selectItem
  .filter(e => e.target.matches('li'))
  .map(e => e.target.innerText)
  .subscribe(text => {
    searchInput.value = text;
    render()
    // 重新 redner，讓點擊後的清單消失
  })



