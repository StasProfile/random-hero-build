const cron = require('node-cron');

class CronService {
    static SCHEDULES = {
        HOURLY: '0 * * * *',
        DAILY: '0 0 * * *',
        WEEKLY: '0 0 * * 0'
    };

    #tasks;
    #isRunning;

    constructor(heroes, items) {
        this.heroes = heroes;
        this.items = items;
        this.#tasks = new Map(); // Изменяем на Map для хранения задач по имени
        this.#isRunning = false;

        // Регистрируем стандартную задачу обновления данных
        this.registerTask('refreshData', this.#refreshData.bind(this));
    }

    async #refreshData() {
        console.log('Starting scheduled data refresh...');
        try {
            await Promise.all([
                this.heroes.refresh(),
                this.items.refresh()
            ]);
            console.log('Scheduled data refresh completed successfully');
        } catch (error) {
            console.error('Failed to refresh data:', error);
            throw error;
        }
    }

    /**
     * Регистрирует новую задачу
     * @param {string} taskName - Уникальное имя задачи
     * @param {Function} taskFn - Асинхронная функция для выполнения
     * @returns {void}
     */
    registerTask(taskName, taskFn) {
        if (this.#tasks.has(taskName)) {
            throw new Error(`Task "${taskName}" is already registered`);
        }
        this.#tasks.set(taskName, { fn: taskFn, cronJob: null });
        console.log(`Task "${taskName}" registered successfully`);
    }

    /**
     * Запускает конкретную задачу по расписанию
     * @param {string} taskName - Имя задачи
     * @param {string} schedule - Cron выражение
     * @returns {void}
     */
    startTask(taskName, schedule = CronService.SCHEDULES.HOURLY) {
        const task = this.#tasks.get(taskName);
        if (!task) {
            throw new Error(`Task "${taskName}" not found`);
        }

        if (task.cronJob) {
            console.warn(`Task "${taskName}" is already running`);
            return;
        }

        if (!cron.validate(schedule)) {
            throw new Error('Invalid cron schedule expression');
        }

        const cronJob = cron.schedule(schedule, async () => {
            try {
                await task.fn();
            } catch (error) {
                console.error(`Task "${taskName}" execution failed:`, error);
            }
        });

        task.cronJob = cronJob;
        console.log(`Task "${taskName}" started with schedule: ${schedule}`);
    }

    /**
     * Останавливает конкретную задачу
     * @param {string} taskName - Имя задачи
     * @returns {void}
     */
    stopTask(taskName) {
        const task = this.#tasks.get(taskName);
        if (!task || !task.cronJob) {
            console.warn(`Task "${taskName}" is not running`);
            return;
        }

        task.cronJob.stop();
        task.cronJob = null;
        console.log(`Task "${taskName}" stopped`);
    }

    /**
     * Запускает все зарегистрированные задачи с указанным расписанием
     * @param {string} schedule - Cron выражение по умолчанию
     * @returns {void}
     */
    start(schedule = CronService.SCHEDULES.HOURLY) {
        if (this.#isRunning) {
            console.warn('Cron service is already running');
            return;
        }

        try {
            for (const [taskName] of this.#tasks) {
                this.startTask(taskName, schedule);
            }
            this.#isRunning = true;
        } catch (error) {
            console.error('Failed to start cron service:', error);
            this.stop(); // Останавливаем все задачи в случае ошибки
            throw error;
        }
    }

    /**
     * Останавливает все задачи
     * @returns {void}
     */
    stop() {
        if (!this.#isRunning) {
            console.warn('Cron service is not running');
            return;
        }

        for (const [taskName] of this.#tasks) {
            this.stopTask(taskName);
        }
        this.#isRunning = false;
        console.log('Cron service stopped');
    }

    get isRunning() {
        return this.#isRunning;
    }

    /**
     * Возвращает список всех зарегистрированных задач и их состояние
     * @returns {Object} Объект с информацией о задачах
     */
    get tasks() {
        const tasksInfo = {};
        for (const [taskName, task] of this.#tasks) {
            tasksInfo[taskName] = {
                isRunning: !!task.cronJob
            };
        }
        return tasksInfo;
    }
}

module.exports = CronService;
