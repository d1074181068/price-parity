const btn_active = document.querySelector('.nav');
const nav_li = document.querySelectorAll('.nav li');
const replace = document.querySelector('.replace');
const search_btn = document.querySelector('.search_btn');
const table_body = document.querySelector('.content tbody');
const search_txt = document.querySelector('.search_adjust p');
const input_txt = document.querySelector('.input');
let all_data = [];
let data = {
    veg: [],
    fruit: [],
    flower: [],
    other: [],
    find: [],
};
let str = '';

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
search_btn.addEventListener('click', () => {
    let value = input_txt.value;
    if (nav_li[0].classList.contains('active')) {
        search_txt.textContent = `查看 「蔬菜」的查詢結果`;
        add_td(data.veg);
    } else if (nav_li[1].classList.contains('active')) {
        search_txt.textContent = `查看 「水果」的查詢結果`;
        add_td(data.fruit);
    } else if (nav_li[2].classList.contains('active')) {
        search_txt.textContent = `查看 「花卉」的查詢結果`;
        add_td(data.flower);
    } else if (nav_li[3].classList.contains('active')) {
        search_txt.textContent = `查看 「其他」的查詢結果`;
        add_td(data.other);
    } else if (value != '') {
        check_value = parseInt(value);
        if (isNaN(check_value)) {
            search_txt.textContent = `查看 「${value}」的查詢結果`;
            filter_data(value);
            add_td(data.find);
            input_txt.value = '';
        } else {
            alert('請輸入正確文字');
        }
    } else {
        search_txt.textContent = `查看 「所有種類」的查詢結果`;
        str = '';
        render(data.veg);
        render(data.fruit);
        render(data.flower);
        render(data.other);
        table_body.innerHTML = str;
    }
});

function add_td(arr) {
    str = '';
    render(arr);
    table_body.innerHTML = str;
}

function render(data_in) {
    data_in.forEach((item) => {
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
            console.log(item);
            data.find.push(item);
        }
    });
    data.flower.forEach((item) => {
        if (item['作物名稱'].match(find_item)) {
            console.log(item);
            data.find.push(item);
        }
    });
    data.other.forEach((item) => {
        if (item['作物名稱'].match(find_item)) {
            console.log(item);
            data.find.push(item);
        }
    });
}

function get_data() {
    // replace.textContent = '資料搜尋中 ... ';
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