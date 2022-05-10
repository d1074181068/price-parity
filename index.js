const btn_active = document.querySelector('.nav');
const nav_li = document.querySelectorAll('.nav li');
const replace = document.querySelector('.replace');
const search_btn = document.querySelector('.search_btn');
const table_body = document.querySelector('.content tbody');
const search_txt = document.querySelector('.search_adjust p');
const input_txt = document.querySelector('.input');
const pageindex = document.querySelector('.page');
const condition = document.querySelector('.condition');
let all_data = [];
let data = {
    veg: [],
    fruit: [],
    flower: [],
    other: [],
    find: [],
    display: [],
    current: [],
    display_sort: [],
    compare_current: [],
};
let txt = '';
let str = '';
let listr = '';
let currentPage = 1;
get_data();

//在 上方選單按鈕加入監聽
btn_active.addEventListener('click', (event) => {
    const target = event.target;
    if (target.nodeName == 'LI') {
        //先把所有li的active清除
        nav_li_reset();

        //再依照點選到的li增加active
        if (target.classList.contains('veg')) {
            nav_li[0].classList.add('active');
        } else if (target.classList.contains('fruit')) {
            nav_li[1].classList.add('active');
        } else if (target.classList.contains('flower')) {
            nav_li[2].classList.add('active');
        } else if (target.classList.contains('other')) {
            nav_li[3].classList.add('active');
        } else if (target.classList.contains('all')) {
            nav_li[4].classList.add('active');
        }
        user_response();
    }
});
/**------------------------------------------------------------------------------- */

//加入鍵盤監聽
input_txt.addEventListener('keypress', (event) => {
    if (event.which == '13') {
        nav_li_reset();
        user_response();
    }
});

//搜尋按鈕加入監聽
search_btn.addEventListener('click', () => {
    nav_li_reset();
    user_response();
});

function user_response() {
    replace.textContent = '資料搜尋中...';
    search_txt.textContent = `查看 「」的查詢結果`;
    table_body.innerHTML = '';
    pageindex.innerHTML = '';
    setTimeout(() => {
        search();
        if (replace.textContent == '很抱歉，你輸入的資料未找到') {
            return;
        } else {
            replace.textContent = '';
        }
    }, 1000);
}

function search() {
    let value = input_txt.value;

    condition.value = '請選擇資料排列條件';
    if (nav_li[0].classList.contains('active')) {
        /**
         * 搜尋後先清除所有li樣式
         * 更改搜尋提示
         * 把專屬的陣列資料 加入目前所使用的陣列(current)
         * 加入欲處理陣列後開始新增資料表格
         */
        nav_li_reset();
        search_txt.textContent = `查看 「蔬菜」的查詢結果`;
        add_current(data.veg);
        add_td(data.veg);
    } else if (nav_li[1].classList.contains('active')) {
        nav_li_reset();
        search_txt.textContent = `查看 「水果」的查詢結果`;
        add_current(data.fruit);
        add_td(data.fruit);
    } else if (nav_li[2].classList.contains('active')) {
        nav_li_reset();
        search_txt.textContent = `查看 「花卉」的查詢結果`;
        add_current(data.flower);
        add_td(data.flower);
    } else if (nav_li[3].classList.contains('active')) {
        nav_li_reset();
        search_txt.textContent = `查看 「其他」的查詢結果`;
        add_current(data.other);
        add_td(data.other);
    } else if (value != '') {
        check_value = parseInt(value);
        if (isNaN(check_value)) {
            //先做陣列初始化
            data.display.splice(0, data.display.length);
            data.current.splice(0, data.current.length);

            search_txt.textContent = `查看 「${value}」的查詢結果`;
            //過濾符合搜尋的陣列 加入find陣列
            filter_data(value);
            if (data.find.length == 0) {
                replace.textContent = '很抱歉，你輸入的資料未找到';
                return;
            } else {
                //把find陣列(就是符合搜尋結果的資料) 推入目前所使用的陣列
                add_current(data.find);
                //加入資料表格
                add_td(data.find);
            }
            input_txt.value = '';
        } else {
            alert('請輸入正確文字');
        }
    } else {
        nav_li_reset();
        search_txt.textContent = `查看 「所有種類」的查詢結果`;
        str = '';
        add_all_current();
        render(data.current);
        table_body.innerHTML = str;
    }
}

function add_all_current() {
    data.current.splice(0, data.current.length);
    currentPage = 1;
    data.veg.forEach((item) => {
        data.current.push(item);
    });
    data.fruit.forEach((item) => {
        data.current.push(item);
    });
    data.flower.forEach((item) => {
        data.current.push(item);
    });
    data.other.forEach((item) => {
        data.current.push(item);
    });
}
//將專屬陣列推入目前要使用的陣列
function add_current(add_arr) {
    data.current.splice(0, data.current.length);
    currentPage = 1;
    add_arr.forEach((item) => {
        data.current.push(item);
    });
}

function filter_data(find_item) {
    //find陣列做初始化
    data.find.splice(0, data.find.length);

    //在每一個陣列中搜尋資料，符合就丟入find陣列中
    data.veg.forEach((item) => {
        if (item['作物名稱'].match(find_item)) {
            data.find.push(item);
        }
    });
    data.fruit.forEach((item) => {
        if (item['作物名稱'].match(find_item)) {
            data.find.push(item);
        }
    });
    data.flower.forEach((item) => {
        if (item['作物名稱'].match(find_item)) {
            data.find.push(item);
        }
    });
    data.other.forEach((item) => {
        if (item['作物名稱'].match(find_item)) {
            data.find.push(item);
        }
    });
}
/**-------------------------------------------------------------------------------- */

//分頁select加入監聽
pageindex.addEventListener('click', (event) => {
    const target = event.target;
    currentPage = target.value;

    if (condition.value == '請選擇資料排列條件') {
        /**
         * 當排序select物件未選擇時 ==> 不需要排序
         * 所以直接用目前使用的陣列去做資料表格
         */
        add_td(data.current);
    } else {
        //display_sort 為排序好的陣列 去增加資料表格
        add_td(data.display_sort);
    }
    pageindex.value = currentPage;
});

//排序select物件監聽
condition.addEventListener('click', (event) => {
    const value = event.target.value;
    if (value == '請選擇資料排列條件') {
        return;
    } else if (value == '依上價排序') {
        /**
         * 先呼叫compare函式 把current陣列所選排序去做比大小排序後
         * 推入display_sort陣列
         *
         * 再把display_sort陣列做資料表格呈現
         */
        compare('上價');
        add_td(data.display_sort);
    } else if (value == '依中價排序') {
        compare('中價');
        add_td(data.display_sort);
    } else if (value == '依下價排序') {
        compare('下價');
        add_td(data.display_sort);
    } else if (value == '依平均價排序') {
        compare('平均價');
        add_td(data.display_sort);
    } else if (value == '依交易量排序') {
        compare('交易量');
        add_td(data.display_sort);
    }
    pageindex.value = currentPage;
});

function compare(sort_con) {
    //先做陣列初始化
    data.display_sort.splice(0, data.display_sort.length);

    //另起一個陣列做排序用
    data.current.forEach((item) => {
        data.compare_current.push(item);
    });
    //max_index 為之後最大陣列index索引值
    let max_index = 0;
    let data_length = data.compare_current.length;

    //做for迴圈依序取最大的數值的物件推入display_sort陣列
    for (i = 0; i < data_length; i++) {
        //去 compare_current 陣列中找物件裡「上價」中最大的數字 回傳max
        let max = data.compare_current.reduce((accumulator, item) => {
            return Math.max(accumulator, item[`${sort_con}`]);
        }, 1);

        const max_obj = data.compare_current.find((item, index) => {
            max_index = index;
            return item[`${sort_con}`] == max;
        });
        //取完一個就刪掉避免重複判斷最大的物件
        data.compare_current.splice(max_index, 1);

        data.display_sort.push(max_obj);
    }
}

function nav_li_reset() {
    nav_li.forEach((item) => {
        item.classList.remove('active');
    });
}

function add_td(arr) {
    str = '';
    render(arr);
    table_body.innerHTML = str;
}

function render(data_in) {
    /**
     * dataTotal 為要處理分頁的陣列的總長度
     *
     * perpage為 一頁中要呈現幾筆資料
     *
     * pageTotal ==> 總頁數  用總長度除以一頁多少筆 就會出現多少頁
     *
     * mindata,maxdata ==> 確認當前頁數的資料索引
     * ex: 第2頁 該出現的資料索引就是30-60
     */
    const dataTotal = data_in.length;
    const perpage = 30;
    const pageTotal = Math.ceil(dataTotal / perpage);
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    const minData = currentPage * perpage - perpage + 1;
    const maxData = currentPage * perpage;

    //欲顯示在網頁的陣列資料做初始化
    data.display.splice(0, data.display.length);
    //將符合頁數中索引值的資料推入網頁要顯示的資料陣列裡(display)
    data_in.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            data.display.push(item);
        }
    });

    //加入頁數
    listr = '';
    for (i = 1; i < pageTotal + 1; i++) {
        listr += `<option>${i}</option>`;
    }
    pageindex.innerHTML = listr;

    display_render();
}

//渲染網頁
function display_render() {
    data.display.forEach((item) => {
        let name = item['作物名稱'];
        let market = item['市場名稱'];
        let up_price = item['上價'];
        let med_price = item['中價'];
        let low_price = item['下價'];
        let avg = item['平均價'];
        let trade = item['交易量'];
        str += `
        <tr>
          <td>${name}</td>
          <td>${market}</td>
          <td>${up_price}</td>
          <td>${med_price}</td>
          <td>${low_price}</td>
          <td>${avg}</td>
          <td>${trade}</td>
        </tr>
        `;
    });
}

//為搜尋結果篩選資料

//axios讀取伺服器資料
function get_data() {
    axios
        .get('https://hexschool.github.io/js-filter-data/data.json')
        .then(function(response) {
            //做資料分類
            response.data.forEach((item) => {
                if (item['種類代碼'] == 'N04') {
                    data.veg.push(item);
                } else if (item['種類代碼'] == 'N05') {
                    data.fruit.push(item);
                } else if (item['種類代碼'] == 'N06') {
                    data.flower.push(item);
                } else {
                    if (item['作物名稱'] != null && item['作物名稱'] != '') {
                        data.other.push(item);
                    }
                }
            });
        });
}