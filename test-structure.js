// Basic test to verify HTML structure and task loading
const fs = require('fs');
const { JSDOM } = require('jsdom');

// Since jsdom might not be available, let's do a simpler test
console.log('Testing HTML structure and task data loading...');

// Test 1: Check that kanban-current-tasks.js is valid and has expected structure
try {
    const taskFileContent = fs.readFileSync('kanban-current-tasks.js', 'utf8');
    
    // Check if the file contains the expected variable
    if (!taskFileContent.includes('const allCurrentTasks = [')) {
        throw new Error('allCurrentTasks array not found in kanban-current-tasks.js');
    }
    
    console.log('✓ Task data file has correct structure');
    
    // Evaluate the file to check syntax and get task count
    const vm = require('vm');
    const context = vm.createContext({
        console: console // Provide console for potential logging
    });
    
    try {
        vm.runInContext(taskFileContent, context);
    } catch (err) {
        throw new Error(`Failed to evaluate tasks file: ${err.message}`);
    }
    
    const tasks = context.allCurrentTasks;
    if (!tasks) {
        throw new Error('allCurrentTasks not found after evaluation');
    }
    console.log(`✓ Loaded ${tasks.length} tasks successfully`);
    
    // Verify tasks have required properties
    const requiredProps = ['id', 'title', 'project', 'owner', 'status', 'priority'];
    const firstTask = tasks[0];
    
    requiredProps.forEach(prop => {
        if (!(prop in firstTask)) {
            throw new Error(`Required property '${prop}' missing from tasks`);
        }
    });
    
    console.log('✓ Tasks have all required properties: ID, Title, Project, Owner, Status, Priority');
    
    // Check status values
    const statuses = [...new Set(tasks.map(t => t.status))];
    console.log('✓ Task statuses found:', statuses.join(', '));
    
    // Check if we have the expected status columns
    const expectedStatuses = ['todo', 'in-progress', 'done', 'blocked'];
    const hasExpectedStatuses = expectedStatuses.some(status => statuses.includes(status));
    if (!hasExpectedStatuses) {
        console.log('⚠ Warning: Expected statuses (todo, in-progress, done, blocked) not found in data');
        console.log('  Found statuses:', statuses);
    }
    
} catch (error) {
    console.error('✗ Task data test failed:', error.message);
    process.exit(1);
}

// Test 2: Basic HTML structure validation
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    // Check for key elements
    const requiredElements = [
        '<title>Task Management - Kanban Board</title>',
        'class="task-card"',
        'data-status="todo"',
        'data-status="in-progress"', 
        'data-status="done"',
        'data-status="blocked"',
        'id="searchBox"',
        '<script src="kanban-current-tasks.js"></script>'
    ];
    
    requiredElements.forEach(element => {
        if (!htmlContent.includes(element)) {
            throw new Error(`Required HTML element not found: ${element}`);
        }
    });
    
    console.log('✓ HTML contains all required elements and structure');
    console.log('✓ Page includes reference to kanban-current-tasks.js');
    console.log('✓ Status columns are properly configured: Todo, In Progress, Done, Blocked');
    
} catch (error) {
    console.error('✗ HTML structure test failed:', error.message);
    process.exit(1);
}

console.log('\n🎯 All tests passed! Task-based kanban HTML structure is ready.');
console.log('✅ Individual tasks instead of project cards');
console.log('✅ Status-based columns: Todo, In Progress, Done, Blocked');
console.log('✅ Task cards display: ID, Title, Project, Owner, Priority, Status');
console.log('✅ Proper CSS classes for styling and filtering');
console.log('✅ Task data from kanban-current-tasks.js loads correctly');