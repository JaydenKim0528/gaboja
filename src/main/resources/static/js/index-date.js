document.addEventListener("DOMContentLoaded", function() {

    // 공휴일 계산 함수
    function getHolidays(year) {
        const holidays = {
            [`${year}-01-01`]: true,  // 신정
            [`${year}-03-01`]: true,  // 삼일절
            [`${year}-05-05`]: true,  // 어린이날
            [`${year}-06-06`]: true,  // 현충일
            [`${year}-08-15`]: true,  // 광복절
            [`${year}-10-03`]: true,  // 개천절
            [`${year}-10-09`]: true,  // 한글날
            [`${year}-12-25`]: true   // 성탄절
        };

        if (year === 2024) {
            holidays['2024-02-10'] = true;  // 설날
            holidays['2024-02-11'] = true;  // 설날 연휴
            holidays['2024-02-12'] = true;  // 설날 연휴
            holidays['2024-09-16'] = true;  // 추석
            holidays['2024-09-17'] = true;  // 추석 연휴
            holidays['2024-09-18'] = true;  // 추석 연휴
        }

        return holidays;
    }

    const holidays = getHolidays(new Date().getFullYear());
    const calendarContainer = document.querySelector('.calendar-container');
    const dateInput = document.querySelector('.index-search-date');
    const footerText = document.querySelector('.selected-dates');
    const monthContainers = document.querySelectorAll('.calendar-month');
    const resetButton = document.querySelector('.reset-button');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    let selectedDates = [formatDate(today), formatDate(tomorrow)];

    calendarContainer.style.display = 'none';
    calendarContainer.style.visibility = 'hidden';

    function positionCalendar() {
        const inputRect = dateInput.getBoundingClientRect();
        const topPosition = inputRect.bottom + window.scrollY;
        const leftPosition = inputRect.left + window.scrollX;
        calendarContainer.style.top = `${topPosition}px`;
        calendarContainer.style.left = `${leftPosition}px`;
    }

    window.addEventListener('resize', positionCalendar);

    dateInput.addEventListener('click', function(event) {
        event.stopPropagation();
        if (calendarContainer.style.display === 'flex') {
            calendarContainer.style.display = 'none';
            calendarContainer.style.visibility = 'hidden';
        } else {
            calendarContainer.style.display = 'flex';
            calendarContainer.style.visibility = 'visible';
            positionCalendar();
        }
    });

    document.addEventListener('click', function(event) {
        if (!calendarContainer.contains(event.target) && !dateInput.contains(event.target)) {
            calendarContainer.style.display = 'none';
            calendarContainer.style.visibility = 'hidden';
        }
    });

    const calendar = {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        selectedDates: selectedDates,

        renderCalendars: function() {
            this.renderCalendar(this.currentMonth, this.currentYear, monthContainers[0]);
            this.renderCalendar(this.currentMonth + 1, this.currentYear, monthContainers[1]);
        },

        renderCalendar: function(month, year, container) {
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthYearLabel = container.querySelector('.month-year-label');
            const calendarDates = container.querySelector('.calendar-dates');

            const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
            monthYearLabel.innerText = `${monthNames[month % 12]}`;
            calendarDates.innerHTML = '';

            for (let i = 0; i < firstDayOfMonth; i++) {
                calendarDates.innerHTML += '<div></div>';
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const date = `${year}-${String((month % 12) + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const isHoliday = holidays[date] || new Date(date).getDay() === 0;
                const isSelected = this.selectedDates.includes(date);
                const dayElem = document.createElement('div');
                dayElem.innerText = i;

                if (isHoliday) {
                    dayElem.classList.add('holiday');
                }

                if (isSelected) {
                    dayElem.classList.add('selected');
                } else if (this.selectedDates.length === 2 && new Date(date) > new Date(this.selectedDates[0]) && new Date(date) < new Date(this.selectedDates[1])) {
                    dayElem.classList.add('highlighted-period');
                }

                dayElem.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.selectDate(date);
                });

                calendarDates.appendChild(dayElem);
            }
        },

        selectDate: function(date) {
            if (this.selectedDates.length === 2) {
                this.selectedDates = [];
            }
            this.selectedDates.push(date);
            this.selectedDates.sort();
            this.updateFooter();
            this.renderCalendars();

            if (this.selectedDates.length === 2) {
                setTimeout(() => {
                    calendarContainer.style.display = 'none';
                    calendarContainer.style.visibility = 'hidden';
                    showPersonDropdown();
                }, 300);
            }
        },

        updateFooter: function() {
            if (this.selectedDates.length === 2) {
                const startDate = new Date(this.selectedDates[0]);
                const endDate = new Date(this.selectedDates[1]);
                const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                footerText.innerText = `${this.selectedDates[0]} - ${this.selectedDates[1]} (${daysDifference}박)`;
                dateInput.value = `${this.selectedDates[0]} - ${this.selectedDates[1]}`;
            } else {
                footerText.innerText = '날짜를 선택하세요';
                dateInput.value = '';
            }
        }
    };

    document.querySelector('.prev-month').addEventListener('click', () => {
        calendar.currentMonth--;
        if (calendar.currentMonth < 0) {
            calendar.currentMonth = 11;
            calendar.currentYear--;
        }
        calendar.renderCalendars();
    });

    document.querySelector('.next-month').addEventListener('click', () => {
        calendar.currentMonth++;
        if (calendar.currentMonth > 11) {
            calendar.currentMonth = 0;
            calendar.currentYear++;
        }
        calendar.renderCalendars();
    });

    // 날짜 선택 시 인원 설정 드롭다운 표시
    document.querySelector('.index-search-date').addEventListener('change', function() {
        showPersonDropdown();  // 날짜 선택 후 인원 선택 창을 자동으로 표시
    });


    resetButton.addEventListener('click', () => {
        calendar.selectedDates = [];
        calendar.updateFooter();
        calendar.renderCalendars();
    });

    calendar.renderCalendars();
    calendar.updateFooter();
});
