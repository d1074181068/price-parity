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
btn_active.addEventListener('click', (event) => {
    const target = event.target;
    if (target.nodeName == 'LI') {
        if (target.classList.contains('veg')) {
            nav_li[0].classList.toggle('active');
            if (
                nav_li[1].classList.contains('active') ||
                nav_li[2].classList.contains('active') ||
                nav_li[3].classList.contains('active') ||
                nav_li[4].classList.contains('active')
            ) {
                nav_li[1].classList.remove('active');
                nav_li[2].classList.remove('active');
                nav_li[3].classList.remove('active');
                nav_li[4].classList.remove('active');
            }
        }
        if (target.classList.contains('fruit')) {
            nav_li[1].classList.toggle('active');
            if (
                nav_li[0].classList.contains('active') ||
                nav_li[2].classList.contains('active') ||
                nav_li[3].classList.contains('active') ||
                nav_li[4].classList.contains('active')
            ) {
                nav_li[0].classList.remove('active');
                nav_li[2].classList.remove('active');
                nav_li[3].classList.remove('active');
                nav_li[4].classList.remove('active');
            }
        }
        if (target.classList.contains('flower')) {
            nav_li[2].classList.toggle('active');
            if (
                nav_li[0].classList.contains('active') ||
                nav_li[1].classList.contains('active') ||
                nav_li[3].classList.contains('active') ||
                nav_li[4].classList.contains('active')
            ) {
                nav_li[0].classList.remove('active');
                nav_li[1].classList.remove('active');
                nav_li[3].classList.remove('active');
                nav_li[4].classList.remove('active');
            }
        }
        if (target.classList.contains('other')) {
            nav_li[3].classList.toggle('active');
            if (
                nav_li[0].classList.contains('active') ||
                nav_li[1].classList.contains('active') ||
                nav_li[2].classList.contains('active') ||
                nav_li[4].classList.contains('active')
            ) {
                nav_li[0].classList.remove('active');
                nav_li[1].classList.remove('active');
                nav_li[2].classList.remove('active');
                nav_li[4].classList.remove('active');
            }
        }
        if (target.classList.contains('all')) {
            nav_li[4].classList.toggle('active');
            if (
                nav_li[0].classList.contains('active') ||
                nav_li[1].classList.contains('active') ||
                nav_li[2].classList.contains('active') ||
                nav_li[3].classList.contains('active')
            ) {
                nav_li[0].classList.remove('active');
                nav_li[1].classList.remove('active');
                nav_li[2].classList.remove('active');
                nav_li[3].classList.remove('active');
            }
        }
    }
});
input_txt.addEventListener('keypress', (event) => {
    if (event.which == '13') {
        replace.textContent = '資料搜尋中...';
        table_body.innerHTML = '';
        pageindex.innerHTML = '';
        setTimeout(() => {
            nav_li_reset();
            search();
            if (replace.textContent == '很抱歉，你輸入的資料未找到') {
                return;
            } else {
                replace.textContent = '';
            }
        }, 1000);
    }
});
search_btn.addEventListener('click', () => {
    replace.textContent = '資料搜尋中...';
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
});
pageindex.addEventListener('click', (event) => {
    const target = event.target;
    currentPage = target.value;
    if (condition.value == '請選擇資料排列條件') {
        add_td(data.current);
    }
    pageindex.value = currentPage;
});
condition.addEventListener('click', (event) => {
    const value = event.target.value;
    if (value == '請選擇資料排列條件') {
        return;
    } else if (value == '依上價排序') {
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
});

function nav_li_reset() {
    nav_li[0].classList.remove('active');
    nav_li[1].classList.remove('active');
    nav_li[2].classList.remove('active');
    nav_li[3].classList.remove('active');
    nav_li[4].classList.remove('active');
}

function search() {
    let value = input_txt.value;

    condition.value = '請選擇資料排列條件';
    if (nav_li[0].classList.contains('active')) {
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
            search_txt.textContent = `查看 「${value}」的查詢結果`;
            filter_data(value);
            if (data.find.length == 0) {
                replace.textContent = '很抱歉，你輸入的資料未找到';
                return;
            } else {
                add_current(data.find);
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

function compare(sort_con) {
    data.display_sort.splice(0, data.display_sort.length);
    data.current.forEach((item) => {
        data.compare_current.push(item);
    });
    let max_index = 0;
    let data_length = data.compare_current.length;
    for (i = 0; i < data_length; i++) {
        let max = data.compare_current.reduce((accumulator, item) => {
            return Math.max(accumulator, item[`${sort_con}`]);
        }, 1);

        const max_obj = data.compare_current.find((item, index) => {
            max_index = index;
            return item[`${sort_con}`] == max;
        });

        data.compare_current.splice(max_index, 1);
        data.display_sort.push(max_obj);
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

function add_current(add_arr) {
    data.current.splice(0, data.current.length);
    currentPage = 1;
    add_arr.forEach((item) => {
        data.current.push(item);
    });
}

function add_td(arr) {
    str = '';
    render(arr);
    table_body.innerHTML = str;
}

function render(data_in) {
    const dataTotal = data_in.length;
    const perpage = 30;
    const pageTotal = Math.ceil(dataTotal / perpage);
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    const minData = currentPage * perpage - perpage + 1;
    const maxData = currentPage * perpage;
    data.display.splice(0, data.display.length);
    data_in.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            data.display.push(item);
        }
    });
    listr = '';
    for (i = 1; i < pageTotal + 1; i++) {
        listr += `<option>${i}</option>`;
    }
    pageindex.innerHTML = listr;
    display_render();
}

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

function filter_data(find_item) {
    data.find.splice(0, data.find.length);
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

function get_data() {
    axios
        .get('https://hexschool.github.io/js-filter-data/data.json')
        .then(function(response) {
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