# 🐛 DEBUG GUIDE: Hover Icons Không Hiển Thị

## 📋 MỤC LỤC

1. [Tư duy debug cơ bản](#tư-duy-debug)
2. [Công cụ Chrome DevTools](#devtools)
3. [Case Study: Hover Icons](#case-study)
4. [Checklist debug](#checklist)
5. [Common Mistakes](#common-mistakes)

---

## 🧠 TƯ DUY DEBUG

### **Framework 5W1H**

```
WHAT    → Vấn đề gì? (Icons không hiện khi hover)
WHERE   → Ở đâu? (MSTable rows)
WHEN    → Khi nào? (User hover vào row)
WHY     → Tại sao? (Chưa biết - cần debug)
WHO     → Ai gặp? (Tất cả users)
HOW     → Fix thế nào? (Sau khi tìm ra WHY)
```

### **Phân tích Logic Flow**

```
User Hover Row
    ↓
Event mouseenter trigger?
    ↓ YES              ↓ NO
Listener attached?     Check addEventListener
    ↓ YES
FloatingButton render?
    ↓ YES              ↓ NO
CSS display correct?   Check v-if/v-show logic
    ↓ YES
Icons inside render?
    ↓ YES              ↓ NO
CSS visible?           Check template/data
    ↓
SOLVED!
```

---

## 🛠️ CHROME DEVTOOLS - 3 TAB CHÍNH

### **1️⃣ TAB ELEMENTS (DOM & CSS)**

#### **Bước 1: Inspect Element**

```
1. Click chuột phải vào table row → "Inspect" (hoặc Ctrl+Shift+C)
2. Quan sát cấu trúc HTML:

<tr class="base-table__row">
  <td>...</td>
  <td class="base-table__cell--relative">
    <div class="base-table__floating-actions"> <!-- Tìm div này -->
      <button class="btn-action btn-action--edit">
        <span class="icon-edit">✎</span>
      </button>
      ...
    </div>
  </td>
</tr>
```

#### **Bước 2: Check Element tồn tại**

```
❌ KHÔNG TÌM THẤY `.base-table__floating-actions`?
   → Vấn đề: Vue không render (kiểm tra v-if/v-show)
   → Debug: Tab Console/Vue DevTools

✅ TÌM THẤY nhưng mờ/không thấy?
   → Vấn đề: CSS (opacity, display, visibility)
   → Debug: Tab Styles bên phải
```

#### **Bước 3: Kiểm tra CSS Styles (Panel bên phải)**

```
Click vào `.base-table__floating-actions` → Xem panel Styles:

📌 CHECK LIST:
☑️ display: flex;     // Nếu display: none → Không hiện
☑️ opacity: 1;        // Nếu opacity: 0 → Trong suốt
☑️ visibility: visible; // Nếu hidden → Ẩn
☑️ position: absolute; // Cần absolute để floating
☑️ z-index: 10;       // Cần cao hơn để nổi lên trên
☑️ pointer-events: auto; // Nếu none → Không click được

🔍 Cách debug CSS:
1. Hover vào row (GIỮ CHUỘT)
2. Nhấn F12 (DevTools vẫn giữ hover state)
3. Xem class nào được apply:
   - Có class `base-table__row--hover`?
   - CSS `.base-table__row--hover .base-table__floating-actions` có opacity: 1?
```

#### **Bước 4: Force Hover State (Test CSS)**

```
1. Click vào <tr> element
2. Tab Styles → Tìm ":hov" button (góc trên bên phải)
3. Tick vào ☑️ :hover
4. Xem icons có hiện không?

✅ HIỆN → CSS đúng, vấn đề là JS event
❌ KHÔNG HIỆN → CSS sai, fix styles
```

---

### **2️⃣ TAB CONSOLE (JavaScript Errors)**

#### **Check Runtime Errors**

```javascript
// Mở Console, tìm các error màu đỏ:

❌ TypeError: Cannot read properties of null
   → Element chưa tồn tại khi addEventListener
   → Fix: Đợi nextTick hoặc onMounted

❌ ReferenceError: handleRowMouseEnter is not defined
   → Function chưa được define
   → Fix: Kiểm tra methods/functions

❌ Warning: Failed to mount component
   → Component có lỗi
   → Fix: Check props/imports
```

#### **Test JavaScript Manually**

```javascript
// Trong Console, test logic:

// 1. Check element tồn tại
document.querySelectorAll('.base-table__row')
// → NodeList(10) [...] ✅ Có rows

// 2. Check event listeners
getEventListeners(document.querySelector('.base-table__row'))
// → {mouseenter: Array(1), mouseleave: Array(1)} ✅ Có listeners
// → {} ❌ Không có listeners → Vấn đề ở addEventListener

// 3. Test hover manually
const row = document.querySelector('.base-table__row')
row.dispatchEvent(new MouseEvent('mouseenter'))
// Xem icons có hiện không
```

---

### **3️⃣ TAB SOURCES (Debug JavaScript)**

#### **Set Breakpoints (Điểm dừng)**

```javascript
// File: MSTable.vue hoặc jobList.vue

// Đặt breakpoint tại function:
const handleRowMouseEnter = (event, row, index) => {
  debugger; // ← Code dừng ở đây
  const rowElement = event.currentTarget;
  console.log('Row hovered:', row, index);
  // ...
};

// Cách đặt breakpoint:
1. Tab Sources → Tìm file MSTable.vue
2. Click vào số dòng (xuất hiện chấm xanh)
3. Hover vào row → Code dừng lại
4. Dùng F10 (Step Over) để chạy từng dòng
5. Xem biến trong panel Scope (bên phải)
```

#### **Watch Expressions (Theo dõi biến)**

```javascript
// Tab Sources → Panel Watch (bên phải) → Click "+"

Thêm expressions để theo dõi:
- showEditButton.value
- editButtonTop.value
- selectedCandidates.value
- event.currentTarget
- rowElement.classList

→ Xem giá trị thay đổi real-time khi hover
```

---

## 🎯 CASE STUDY: DEBUG HOVER ICONS

### **Scenario: Icons không hiện khi hover**

#### **Step 1: Reproduce Issue**

```
1. Mở trang jobList
2. Hover vào row bất kỳ
3. Xác nhận: Không thấy nút Edit/Delete
```

#### **Step 2: Inspect DOM**

```
F12 → Tab Elements → Hover vào row → Inspect

✅ CÓ element `.base-table__floating-actions`
→ Vue đã render, vấn đề là CSS hoặc timing

❌ KHÔNG CÓ element
→ Vue chưa render, kiểm tra:
  - v-if="showActions" trong MSTable.vue
  - :show-actions="true" trong jobList.vue
```

#### **Step 3: Check CSS**

```
Click vào `.base-table__floating-actions` → Xem Styles:

❌ FOUND: opacity: 0;
→ Root Cause: CSS không set opacity: 1 khi hover

FIX:
.base-table__row--hover .base-table__floating-actions {
  opacity: 1; /* ← Thêm dòng này */
}
```

#### **Step 4: Check JavaScript Events**

```
Tab Console → Run:

getEventListeners(document.querySelector('.base-table__row'))

❌ RESULT: {} (empty)
→ Root Cause: Event listeners chưa được attach

WHY? Check code:
- addEventListener gọi trong onMounted?
- Elements đã tồn tại khi gọi addEventListener?
- nextTick được dùng chưa?

FIX:
watch([candidates], async () => {
  await nextTick(); // ← Chờ DOM update
  setupRowEventListeners();
}, { immediate: true });
```

#### **Step 5: Verify Fix**

```
1. Refresh trang
2. Hover vào row
3. Check Console: Không có errors
4. Check Elements: Icons visible
5. Click icons: Edit/Delete hoạt động
```

---

## ✅ CHECKLIST DEBUG (Áp dụng cho MỌI bug)

### **🔍 Phase 1: REPRODUCE (Tái hiện lỗi)**

```
☐ Có thể tái hiện lỗi 100%?
☐ Lỗi xảy ra ở browser nào? (Chrome, Firefox, Safari)
☐ Lỗi xảy ra ở device nào? (Desktop, Mobile, Tablet)
☐ Có log error trong Console không?
☐ Có warning trong Console không?
```

### **🔍 Phase 2: ISOLATE (Cô lập nguyên nhân)**

```
☐ Lỗi ở phần nào? (HTML, CSS, JavaScript, Data)
☐ Component nào có vấn đề? (MSTable, jobList, ...)
☐ Function nào có vấn đề? (handleRowMouseEnter, ...)
☐ Event nào không trigger? (mouseenter, click, ...)
☐ CSS rule nào không apply? (:hover, .active, ...)
```

### **🔍 Phase 3: VERIFY (Xác minh giả thuyết)**

```
☐ Set breakpoint → Step through code
☐ Console.log key variables
☐ Force CSS states (:hover, :active)
☐ Test với data đơn giản
☐ Disable CSS/JS từng phần để tìm culprit
```

### **🔍 Phase 4: FIX (Sửa lỗi)**

```
☐ Hiểu root cause (nguyên nhân gốc)
☐ Fix minimal (sửa ít code nhất có thể)
☐ Test fix trong nhiều scenarios
☐ Không tạo regression bugs (lỗi mới)
☐ Commit với clear message
```

### **🔍 Phase 5: DOCUMENT (Ghi chép)**

```
☐ Comment code phức tạp
☐ Update README nếu cần
☐ Share knowledge với team
☐ Add to bug tracking system
```

---

## 🚨 COMMON MISTAKES (Lỗi thường gặp)

### **1. Vue Lifecycle Issues**

```javascript
❌ SAI:
onMounted(() => {
  const rows = document.querySelectorAll('.base-table__row');
  rows.forEach(row => { /* ... */ }); // rows = [] nếu data chưa load
});

✅ ĐÚNG:
watch([candidates], async () => {
  await nextTick(); // Chờ Vue render xong DOM
  const rows = document.querySelectorAll('.base-table__row');
  rows.forEach(row => { /* ... */ });
}, { immediate: true });
```

### **2. CSS Specificity Issues**

```css
❌ SAI (Specificity thấp):
.base-table__floating-actions {
  opacity: 1; /* Không override được opacity: 0 ở base */
}

✅ ĐÚNG (Specificity cao):
.base-table__row--hover .base-table__floating-actions {
  opacity: 1 !important; /* Hoặc tăng specificity */
}
```

### **3. Event Delegation vs Direct Binding**

```javascript
❌ SAI (Event bị mất khi re-render):
rows.forEach(row => {
  row.addEventListener('mouseenter', handler);
});
// Khi data thay đổi → rows mới render → mất events

✅ ĐÚNG (Event delegation):
tableElement.addEventListener('mouseenter', (e) => {
  if (e.target.closest('.base-table__row')) {
    handler(e);
  }
}, true); // Capture phase để catch tất cả events
```

### **4. Timing Issues**

```javascript
❌ SAI:
onMounted(() => {
  setupEvents(); // Data chưa load từ API
});

✅ ĐÚNG:
watch(() => candidates.value, async () => {
  if (candidates.value.length > 0) {
    await nextTick();
    setupEvents();
  }
}, { immediate: true });
```

### **5. Z-Index Stacking Context**

```css
❌ SAI:
.base-table__floating-actions {
  z-index: 9999; /* Không hoạt động nếu parent có z-index thấp */
}

✅ ĐÚNG:
.base-table__cell--relative {
  position: relative; /* Tạo stacking context mới */
  z-index: 1;
}
.base-table__floating-actions {
  position: absolute;
  z-index: 10; /* So sánh trong cùng stacking context */
}
```

---

## 🎓 DEBUG EXERCISES (Bài tập thực hành)

### **Exercise 1: Icons render nhưng không click được**

```
HINT:
- Check pointer-events
- Check z-index
- Check event listeners
```

### **Exercise 2: Hover row đầu tiên OK, row khác không OK**

```
HINT:
- Check querySelector vs querySelectorAll
- Check event loop/index
- Check Vue key prop
```

### **Exercise 3: Hover nhanh nhiều rows → Icons nhấp nháy**

```
HINT:
- Check debounce/throttle
- Check transition timing
- Check event cleanup
```

---

## 📚 TÀI LIỆU THAM KHẢO

### **Chrome DevTools Official Docs**

- [Inspect DOM](https://developer.chrome.com/docs/devtools/dom/)
- [Debug JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
- [CSS Debugging](https://developer.chrome.com/docs/devtools/css/)

### **Vue DevTools**

- [Vue DevTools Extension](https://devtools.vuejs.org/)
- Component inspection
- State management debugging

### **Debugging Best Practices**

- Always reproduce first
- Isolate the problem
- Use scientific method (hypothesis → test → verify)
- Document findings
- Share knowledge

---

## 🎯 SUMMARY

**5 bước debug bất kỳ bug nào:**

1. **WHAT** → Vấn đề là gì? (Icons không hiện)
2. **WHERE** → Lỗi ở đâu? (DOM, CSS, JS, Data?)
3. **WHY** → Nguyên nhân? (Dùng DevTools tìm)
4. **HOW** → Fix thế nào? (Sửa minimal, test kỹ)
5. **VERIFY** → Xác nhận? (Test lại, no regression)

**3 công cụ chính:**

- **Elements** → Check DOM & CSS
- **Console** → Check JS errors & test code
- **Sources** → Debug step-by-step với breakpoints

**Mindset:**

- Bugs là cơ hội học hỏi, không phải thất bại
- Debug có hệ thống, không đoán mò
- Document findings để tránh lặp lại lỗi
- Hỏi khi stuck >30 phút

---

**Happy Debugging! 🐛→🦋**
