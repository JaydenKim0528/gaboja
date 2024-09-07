document.addEventListener("DOMContentLoaded", function() {
    const personInput = document.querySelector('.index-search-people');
    const dropdownContainer = document.querySelector('.dropdown-container');
    let peopleCount = 2; // 기본 인원수 설정

    // 인원 선택 드롭다운 표시 함수
    function showPersonDropdown() {
        const personInput = document.querySelector('.index-search-people');
        const dropdownContainer = document.querySelector('.dropdown-container');
        const inputRect = personInput.getBoundingClientRect();

        // 원하는 위치로 top 값을 수동 조정
        dropdownContainer.style.top = `${inputRect.bottom + window.scrollY - 78}px`;  // input 바로 아래로 설정 (여기서 50은 추가적인 마진 값)
        dropdownContainer.style.left = `${inputRect.left}px`;  // input과 수평 맞추기
        dropdownContainer.style.width = `${inputRect.width}px`;  // input 너비에 맞춤
        dropdownContainer.style.position = 'absolute';

        dropdownContainer.style.display = 'block';  // 드롭다운 표시
        dropdownContainer.style.visibility = 'visible';
    }


    // 글로벌 스코프에 함수 할당
    window.showPersonDropdown = showPersonDropdown;


    // 드롭다운 숨기기 함수
    function hidePersonDropdown() {
        dropdownContainer.style.display = 'none';
        dropdownContainer.style.visibility = 'hidden';
    }

    personInput.addEventListener('click', function(event) {
        event.stopPropagation();
        showPersonDropdown();
    });

    document.addEventListener('click', function(event) {
        if (!dropdownContainer.contains(event.target) && !personInput.contains(event.target)) {
            hidePersonDropdown();
        }
    });

    document.querySelector('.person-decrease').addEventListener('click', function() {
        if (peopleCount > 1) {
            peopleCount--;
            updatePeopleCount();
        }
    });

    document.querySelector('.person-increase').addEventListener('click', function() {
        peopleCount++;
        updatePeopleCount();
    });

    function updatePeopleCount() {
        personInput.value = `인원 ${peopleCount}명`;
        dropdownContainer.querySelector('.people-count').innerText = peopleCount;
    }

    // 날짜 선택 후 인원 설정 드롭다운 표시
    document.querySelector('.index-search-date').addEventListener('change', function() {
        showPersonDropdown();
    });

    updatePeopleCount();
});
