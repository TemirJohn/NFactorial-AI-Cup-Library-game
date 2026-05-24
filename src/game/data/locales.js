export const LOCALES = {
  ru: {
    // Menu
    menu_start: 'Начать игру',
    menu_instructions: 'Инструкции',
    menu_howToPlay: 'КАК ИГРАТЬ',
    menu_survive: 'Выживи 30 минут в хаосе библиотеки!',
    menu_controls: 'УПРАВЛЕНИЕ:',
    menu_ctrl_move: 'WASD / Стрелки — Движение',
    menu_ctrl_sprint: 'Shift — Бег (тратит выносливость)',
    menu_ctrl_pause: 'P / Escape — Пауза',
    menu_ctrl_shush: 'F — Шшш! (после подбора предмета)',
    menu_gameplay: 'ИГРОВОЙ ПРОЦЕСС:',
    menu_gp_pickup: '• Книги подбираются автоматически',
    menu_gp_return: '• Возвращай книги на полки нужного цвета',
    menu_gp_kids: '• Дети крадут книги — прогони их!',
    menu_gp_chaos: '• Держи Хаос ниже 100% или проиграешь',
    menu_gp_level: '• Повышай уровень и выбирай улучшения',
    menu_back: 'Нажми Enter или Escape для возврата',

    // Pause
    pause_title: 'ПАУЗА',
    pause_resume: 'Продолжить',
    pause_restart: 'Перезапустить',
    pause_mainMenu: 'Главное меню',

    // Game Over
    gameover_playAgain: 'Играть снова',
    gameover_mainMenu: 'Главное меню',
    gameover_victory: 'ПОБЕДА!',
    gameover_gameOver: 'КОНЕЦ ИГРЫ',
    gameover_victoryMsg: 'Ты пережил 30 минут хаоса библиотеки!',
    gameover_chaosMsg: 'Библиотека погрузилась в хаос...',
    gameover_chaosOverwhelmed: 'Хаос захлестнул библиотеку!',
    gameover_timeSurvived: 'Время выживания:',
    gameover_finalLevel: 'Финальный уровень:',
    gameover_peakChaos: 'Пик хаоса:',
    gameover_booksCollected: 'Книг собрано:',
    gameover_booksShelved: 'Книг расставлено:',
    gameover_kidsRepelled: 'Детей прогнано:',

    // Upgrades screen
    upgrade_levelUp: 'УРОВЕНЬ ВЫШЕ!',
    upgrade_choose: 'Выберите улучшение:',
    upgrade_hint: '← → или мышь, Enter / Пробел / 1-3 для выбора',
    upgrade_level: (cur, nxt) => `Уровень ${cur} → ${nxt}`,

    // Upgrade names/descriptions
    upgrade_speed_name: 'Удобная обувь',
    upgrade_speed_desc: 'Увеличивает скорость движения на 10%',
    upgrade_speed_effect: (lvl) => `+${10 * lvl}% Скорость движения`,

    upgrade_pickupRadius_name: 'Длинные руки',
    upgrade_pickupRadius_desc: 'Увеличивает радиус подбора книг на 0.1м',
    upgrade_pickupRadius_effect: (lvl) => `+${(0.1 * lvl).toFixed(1)}м Радиус подбора`,

    upgrade_carrySlots_name: 'Книжный пояс',
    upgrade_carrySlots_desc: 'Носить 1 дополнительную книгу',
    upgrade_carrySlots_effect: (lvl) => `+${lvl} Слотов для книг`,

    upgrade_stamina_name: 'Тренировка',
    upgrade_stamina_desc: 'Увеличивает максимальную выносливость на 10',
    upgrade_stamina_effect: (lvl) => `+${10 * lvl} Макс. выносливость`,

    upgrade_chaosDampening_name: 'Дзен-фокус',
    upgrade_chaosDampening_desc: 'Уменьшает прирост хаоса на 2%',
    upgrade_chaosDampening_effect: (lvl) => `-${2 * lvl}% Прирост хаоса`,

    upgrade_xpGain_name: 'Очки для чтения',
    upgrade_xpGain_desc: 'Увеличивает получение опыта на 8%',
    upgrade_xpGain_effect: (lvl) => `+${8 * lvl}% Получение опыта`,

    // HUD
    hud_chaos: 'ХАОС',
    hud_kids: 'Дети',
    hud_stamina: 'Выносливость',
    hud_books: 'Книги',
    hud_sprinting: 'БЕГ',
    hud_level: 'Уровень',
    hud_xp: 'ОП',

    // Power-up particles
    pu_shush: '🤫 Нажми F!',
    pu_coffee: '☕ Безлимитная выносливость!',
    pu_magnet: '🧲 Магнит книг активирован!',
    pu_freeze: '❄️ Все дети заморожены!',
    pu_chaos: '🌀 Хаос -25!',
  },

  kz: {
    // Menu
    menu_start: 'Ойынды бастау',
    menu_instructions: 'Нұсқаулар',
    menu_howToPlay: 'ҚАЛАЙ ОЙНАУ',
    menu_survive: 'Кітапханадағы хаостан 30 минут аман өт!',
    menu_controls: 'БАСҚАРУ:',
    menu_ctrl_move: 'WASD / Жебелер — Қозғалу',
    menu_ctrl_sprint: 'Shift — Жүгіру (шыдамдылықты жұмсайды)',
    menu_ctrl_pause: 'P / Escape — Тоқтату',
    menu_ctrl_shush: 'F — Тш-ш! (заттан кейін)',
    menu_gameplay: 'ОЙЫН ПРОЦЕСІ:',
    menu_gp_pickup: '• Кітаптар жақын болса автоматты алынады',
    menu_gp_return: '• Кітаптарды түсіне сәйкес сөреге қайтар',
    menu_gp_kids: '• Балалар кітап ұрлайды — оларды қу!',
    menu_gp_chaos: '• Хаосты 100%-дан төмен ұста, әйтпесе ұтыласың',
    menu_gp_level: '• Деңгей шыққанда жақсартуларды таңда',
    menu_back: 'Оралу үшін Enter немесе Escape басыңыз',

    // Pause
    pause_title: 'ТОҚТАТЫЛДЫ',
    pause_resume: 'Жалғастыру',
    pause_restart: 'Қайта бастау',
    pause_mainMenu: 'Басты мәзір',

    // Game Over
    gameover_playAgain: 'Қайта ойнау',
    gameover_mainMenu: 'Басты мәзір',
    gameover_victory: 'ЖЕҢІС!',
    gameover_gameOver: 'ОЙЫН БІТТІ',
    gameover_victoryMsg: 'Кітапхана хаосынан 30 минут аман өттіңіз!',
    gameover_chaosMsg: 'Кітапхана хаосқа батты...',
    gameover_chaosOverwhelmed: 'Хаос кітапхананы жайлады!',
    gameover_timeSurvived: 'Өткен уақыт:',
    gameover_finalLevel: 'Соңғы деңгей:',
    gameover_peakChaos: 'Ең жоғары хаос:',
    gameover_booksCollected: 'Жиналған кітап:',
    gameover_booksShelved: 'Сөреге қойылған:',
    gameover_kidsRepelled: 'Балалар қуылды:',

    // Upgrades screen
    upgrade_levelUp: 'ДЕҢГЕЙ ЖОҒАРЫЛАДЫ!',
    upgrade_choose: 'Жақсартуды таңдаңыз:',
    upgrade_hint: '← → немесе тышқан, Enter / Бос орын / 1-3 таңдау',
    upgrade_level: (cur, nxt) => `Деңгей ${cur} → ${nxt}`,

    // Upgrade names/descriptions
    upgrade_speed_name: 'Жайлы аяқкиім',
    upgrade_speed_desc: 'Қозғалыс жылдамдығын 10% арттырады',
    upgrade_speed_effect: (lvl) => `+${10 * lvl}% Қозғалыс жылдамдығы`,

    upgrade_pickupRadius_name: 'Ұзын қолдар',
    upgrade_pickupRadius_desc: 'Кітап алу радиусын 0.1м арттырады',
    upgrade_pickupRadius_effect: (lvl) => `+${(0.1 * lvl).toFixed(1)}м Алу радиусы`,

    upgrade_carrySlots_name: 'Кітап белдігі',
    upgrade_carrySlots_desc: '1 қосымша кітап тасу',
    upgrade_carrySlots_effect: (lvl) => `+${lvl} Кітап ұяшығы`,

    upgrade_stamina_name: 'Дене тәрбиесі',
    upgrade_stamina_desc: 'Максималды шыдамдылықты 10 арттырады',
    upgrade_stamina_effect: (lvl) => `+${10 * lvl} Макс. шыдамдылық`,

    upgrade_chaosDampening_name: 'Зен-фокус',
    upgrade_chaosDampening_desc: 'Хаос өсімін 2% азайтады',
    upgrade_chaosDampening_effect: (lvl) => `-${2 * lvl}% Хаос өсімі`,

    upgrade_xpGain_name: 'Оқу көзілдірігі',
    upgrade_xpGain_desc: 'Тәжірибе алуды 8% арттырады',
    upgrade_xpGain_effect: (lvl) => `+${8 * lvl}% Тәжірибе`,

    // HUD
    hud_chaos: 'ХАОС',
    hud_kids: 'Балалар',
    hud_stamina: 'Шыдамдылық',
    hud_books: 'Кітаптар',
    hud_sprinting: 'ЖҮГІРУ',
    hud_level: 'Деңгей',
    hud_xp: 'ТЖ',

    // Power-up particles
    pu_shush: '🤫 F басыңыз!',
    pu_coffee: '☕ Шексіз шыдамдылық!',
    pu_magnet: '🧲 Кітап магниті іске қосылды!',
    pu_freeze: '❄️ Барлық балалар тоңды!',
    pu_chaos: '🌀 Хаос -25!',
  },
};
