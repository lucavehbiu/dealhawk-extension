/**
 * NOTION TEMPLATE BUILDER
 * Programmatically build Notion templates using the Notion API
 *
 * Setup:
 * 1. npm install @notionhq/client
 * 2. Get Notion API key: https://www.notion.so/my-integrations
 * 3. Create a blank Notion page and get the page ID
 * 4. Share the page with your integration
 * 5. Run: node build-templates-auto.js
 */

const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY, // Set this in your environment
});

/**
 * Build the Student Success System template
 */
async function buildStudentTemplate(parentPageId) {
  console.log('🎓 Building Student Success System...');

  // 1. Create main dashboard page
  const dashboard = await notion.pages.create({
    parent: { page_id: parentPageId },
    icon: { emoji: '🎓' },
    cover: {
      type: 'external',
      external: { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' }
    },
    properties: {
      title: {
        title: [{ text: { content: 'Student Success System' } }]
      }
    },
    children: [
      // Dashboard overview
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ text: { content: '👋 Welcome to Your Student Success System' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: { content: 'Your complete academic command center. Everything you need to ace this semester.' }
          }]
        }
      },
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      // Quick stats callout
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '📊' },
          rich_text: [{ text: { content: 'Semester Overview' } }],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [{ text: { content: 'Current GPA: 3.85 | Classes: 5 | Credits: 16' } }]
              }
            }
          ]
        }
      }
    ]
  });

  console.log(`✅ Dashboard created: ${dashboard.id}`);

  // 2. Create Classes Database
  const classesDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '📚' },
    title: [{ text: { content: 'Classes & Schedule' } }],
    properties: {
      'Course Name': { title: {} },
      'Code': { rich_text: {} },
      'Credits': { number: { format: 'number' } },
      'Professor': { rich_text: {} },
      'Days': {
        multi_select: {
          options: [
            { name: 'Monday', color: 'blue' },
            { name: 'Tuesday', color: 'green' },
            { name: 'Wednesday', color: 'yellow' },
            { name: 'Thursday', color: 'orange' },
            { name: 'Friday', color: 'red' }
          ]
        }
      },
      'Time': { rich_text: {} },
      'Location': { rich_text: {} },
      'Current Grade': { number: { format: 'percent' } },
      'Letter Grade': {
        select: {
          options: [
            { name: 'A', color: 'green' },
            { name: 'A-', color: 'green' },
            { name: 'B+', color: 'yellow' },
            { name: 'B', color: 'yellow' },
            { name: 'B-', color: 'orange' },
            { name: 'C+', color: 'orange' },
            { name: 'C', color: 'red' }
          ]
        }
      }
    }
  });

  console.log(`✅ Classes database created: ${classesDb.id}`);

  // 3. Create Assignments Database
  const assignmentsDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '📋' },
    title: [{ text: { content: 'Assignments & Tasks' } }],
    properties: {
      'Assignment': { title: {} },
      'Class': {
        relation: {
          database_id: classesDb.id,
          single_property: {}
        }
      },
      'Type': {
        select: {
          options: [
            { name: 'Homework', color: 'blue' },
            { name: 'Essay', color: 'purple' },
            { name: 'Project', color: 'orange' },
            { name: 'Lab', color: 'green' },
            { name: 'Quiz', color: 'yellow' },
            { name: 'Exam', color: 'red' }
          ]
        }
      },
      'Due Date': { date: {} },
      'Status': {
        select: {
          options: [
            { name: 'Not Started', color: 'gray' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Complete', color: 'green' },
            { name: 'Submitted', color: 'blue' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: '🔴 Urgent', color: 'red' },
            { name: '🟡 Medium', color: 'yellow' },
            { name: '🟢 Low', color: 'green' }
          ]
        }
      },
      'Estimated Time': { number: { format: 'number' } },
      'Grade Weight': { number: { format: 'percent' } }
    }
  });

  console.log(`✅ Assignments database created: ${assignmentsDb.id}`);

  // 4. Create GPA Calculator page
  const gpaPage = await notion.pages.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '📊' },
    properties: {
      title: { title: [{ text: { content: 'GPA Calculator' } }] }
    },
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: 'Current Semester GPA' } }]
        }
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '🎯' },
          rich_text: [{
            text: {
              content: 'Your GPA is automatically calculated based on your current grades in the Classes database!'
            }
          }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Formula: Total Quality Points / Total Credits\n\nQuality Points = (Grade Point × Credits) for each class'
            }
          }]
        }
      }
    ]
  });

  console.log(`✅ GPA Calculator created: ${gpaPage.id}`);

  // 5. Create Study Planner
  const studyDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '📖' },
    title: [{ text: { content: 'Study Sessions' } }],
    properties: {
      'Session': { title: {} },
      'Subject': {
        relation: {
          database_id: classesDb.id,
          single_property: {}
        }
      },
      'Date': { date: {} },
      'Duration': { number: { format: 'number' } },
      'Technique': {
        select: {
          options: [
            { name: 'Pomodoro', color: 'red' },
            { name: 'Active Recall', color: 'blue' },
            { name: 'Spaced Repetition', color: 'green' },
            { name: 'Feynman Technique', color: 'purple' }
          ]
        }
      },
      'Productivity': {
        select: {
          options: [
            { name: '🔥 Excellent', color: 'green' },
            { name: '✅ Good', color: 'blue' },
            { name: '😐 Okay', color: 'yellow' },
            { name: '😴 Poor', color: 'red' }
          ]
        }
      },
      'Notes': { rich_text: {} }
    }
  });

  console.log(`✅ Study Planner created: ${studyDb.id}`);

  // 6. Create Scholarship Tracker
  const scholarshipDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '💰' },
    title: [{ text: { content: 'Scholarships & Financial Aid' } }],
    properties: {
      'Scholarship Name': { title: {} },
      'Amount': { number: { format: 'dollar' } },
      'Deadline': { date: {} },
      'Status': {
        select: {
          options: [
            { name: '📝 To Apply', color: 'gray' },
            { name: '⏳ In Progress', color: 'yellow' },
            { name: '✅ Submitted', color: 'blue' },
            { name: '🎉 Awarded', color: 'green' },
            { name: '❌ Rejected', color: 'red' }
          ]
        }
      },
      'Requirements': { rich_text: {} },
      'Next Step': { rich_text: {} },
      'Decision Date': { date: {} }
    }
  });

  console.log(`✅ Scholarship Tracker created: ${scholarshipDb.id}`);

  console.log('\n🎉 Student Success System template built successfully!');
  console.log(`📝 Template link: https://notion.so/${dashboard.id.replace(/-/g, '')}`);

  return dashboard.id;
}

/**
 * Build the Content Creator Hub template
 */
async function buildCreatorTemplate(parentPageId) {
  console.log('🎬 Building Content Creator Hub...');

  const dashboard = await notion.pages.create({
    parent: { page_id: parentPageId },
    icon: { emoji: '🎬' },
    cover: {
      type: 'external',
      external: { url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0' }
    },
    properties: {
      title: { title: [{ text: { content: 'Content Creator Hub Pro' } }] }
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ text: { content: '🎬 Your Content Empire Dashboard' } }]
        }
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { emoji: '📊' },
          rich_text: [{ text: { content: 'Quick Stats: 125K YouTube Subs | 250K TikTok | 85K IG | $8,450 Revenue This Month' } }]
        }
      }
    ]
  });

  // Content Calendar Database
  const contentDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '📅' },
    title: [{ text: { content: 'Content Calendar' } }],
    properties: {
      'Title': { title: {} },
      'Platform': {
        multi_select: {
          options: [
            { name: 'YouTube', color: 'red' },
            { name: 'TikTok', color: 'pink' },
            { name: 'Instagram', color: 'purple' },
            { name: 'Twitter', color: 'blue' },
            { name: 'Newsletter', color: 'green' }
          ]
        }
      },
      'Type': {
        select: {
          options: [
            { name: 'Long-form Video', color: 'red' },
            { name: 'Short-form', color: 'orange' },
            { name: 'Reel', color: 'purple' },
            { name: 'Thread', color: 'blue' },
            { name: 'Article', color: 'green' }
          ]
        }
      },
      'Publish Date': { date: {} },
      'Status': {
        select: {
          options: [
            { name: '💡 Idea', color: 'gray' },
            { name: '📝 Scripted', color: 'yellow' },
            { name: '🎬 Filming', color: 'orange' },
            { name: '✂️ Editing', color: 'blue' },
            { name: '📅 Scheduled', color: 'purple' },
            { name: '✅ Published', color: 'green' }
          ]
        }
      },
      'Views': { number: { format: 'number' } },
      'Engagement Rate': { number: { format: 'percent' } },
      'Revenue': { number: { format: 'dollar' } }
    }
  });

  // Brand Deals Database
  const brandsDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '🤝' },
    title: [{ text: { content: 'Brand Deals Pipeline' } }],
    properties: {
      'Brand': { title: {} },
      'Platform': {
        select: {
          options: [
            { name: 'YouTube', color: 'red' },
            { name: 'Instagram', color: 'purple' },
            { name: 'TikTok', color: 'pink' },
            { name: 'Newsletter', color: 'green' },
            { name: 'Multiple', color: 'blue' }
          ]
        }
      },
      'Deal Size': { number: { format: 'dollar' } },
      'Status': {
        select: {
          options: [
            { name: '📧 First Contact', color: 'gray' },
            { name: '📝 Proposal Sent', color: 'yellow' },
            { name: '💬 Negotiating', color: 'orange' },
            { name: '✅ Signed', color: 'green' },
            { name: '🎬 In Progress', color: 'blue' },
            { name: '✅ Complete', color: 'purple' }
          ]
        }
      },
      'Contact': { email: {} },
      'Deadline': { date: {} },
      'Deliverables': { rich_text: {} }
    }
  });

  // Revenue Tracker
  const revenueDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '💰' },
    title: [{ text: { content: 'Revenue Tracker' } }],
    properties: {
      'Income Source': { title: {} },
      'Platform': { rich_text: {} },
      'Amount': { number: { format: 'dollar' } },
      'Date': { date: {} },
      'Type': {
        select: {
          options: [
            { name: 'AdSense', color: 'green' },
            { name: 'Brand Deal', color: 'purple' },
            { name: 'Affiliate', color: 'blue' },
            { name: 'Course Sales', color: 'orange' },
            { name: 'Sponsorship', color: 'red' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: '✅ Paid', color: 'green' },
            { name: '⏳ Pending', color: 'yellow' },
            { name: '📧 Invoiced', color: 'blue' }
          ]
        }
      }
    }
  });

  console.log('✅ Content Creator Hub built!');
  return dashboard.id;
}

/**
 * Build the Life OS template
 */
async function buildLifeOSTemplate(parentPageId) {
  console.log('🧠 Building Life OS 2.0...');

  const dashboard = await notion.pages.create({
    parent: { page_id: parentPageId },
    icon: { emoji: '🧠' },
    cover: {
      type: 'external',
      external: { url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b' }
    },
    properties: {
      title: { title: [{ text: { content: 'Life OS 2.0' } }] }
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ text: { content: '🧠 Your Personal Operating System' } }]
        }
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ text: { content: 'Organize your entire life in one place. Based on PARA + GTD frameworks.' } }]
        }
      }
    ]
  });

  // Quick Capture Inbox
  const inboxDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '📥' },
    title: [{ text: { content: 'Quick Capture Inbox' } }],
    properties: {
      'Item': { title: {} },
      'Type': {
        select: {
          options: [
            { name: 'Task', color: 'blue' },
            { name: 'Idea', color: 'purple' },
            { name: 'Note', color: 'green' },
            { name: 'Expense', color: 'red' },
            { name: 'Journal', color: 'yellow' }
          ]
        }
      },
      'Date Added': {
        date: {},
        created_time: {}
      },
      'Processed': { checkbox: {} }
    }
  });

  // Tasks & Projects Database
  const tasksDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '✅' },
    title: [{ text: { content: 'Tasks & Projects' } }],
    properties: {
      'Task': { title: {} },
      'Project': {
        select: {
          options: [
            { name: 'Side Hustle', color: 'purple' },
            { name: 'Career', color: 'blue' },
            { name: 'Health', color: 'green' },
            { name: 'Personal', color: 'yellow' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: '📝 To Do', color: 'gray' },
            { name: '🟡 In Progress', color: 'yellow' },
            { name: '✅ Done', color: 'green' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'P1 - Urgent & Important', color: 'red' },
            { name: 'P2 - Important', color: 'orange' },
            { name: 'P3 - Nice to have', color: 'yellow' },
            { name: 'P4 - Someday', color: 'gray' }
          ]
        }
      },
      'Due Date': { date: {} },
      'Estimated Time': { number: {} }
    }
  });

  // Goals Database
  const goalsDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '🎯' },
    title: [{ text: { content: 'Goals & Milestones' } }],
    properties: {
      'Goal': { title: {} },
      'Category': {
        select: {
          options: [
            { name: '💼 Career', color: 'blue' },
            { name: '💰 Financial', color: 'green' },
            { name: '🏋️ Health', color: 'red' },
            { name: '📚 Learning', color: 'purple' },
            { name: '❤️ Relationships', color: 'pink' }
          ]
        }
      },
      'Target': { rich_text: {} },
      'Current Progress': { number: { format: 'number' } },
      'Target Amount': { number: { format: 'number' } },
      'Progress %': { formula: { expression: 'prop("Current Progress") / prop("Target Amount")' } },
      'Deadline': { date: {} },
      'Status': {
        select: {
          options: [
            { name: '🟢 On Track', color: 'green' },
            { name: '🟡 At Risk', color: 'yellow' },
            { name: '🔴 Behind', color: 'red' },
            { name: '✅ Complete', color: 'blue' }
          ]
        }
      }
    }
  });

  // Habit Tracker
  const habitsDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '💪' },
    title: [{ text: { content: 'Daily Habits' } }],
    properties: {
      'Habit': { title: {} },
      'Frequency Goal': { rich_text: {} },
      'Current Streak': { number: {} },
      'Best Streak': { number: {} },
      'This Week': { rich_text: {} },
      'Category': {
        select: {
          options: [
            { name: 'Health', color: 'green' },
            { name: 'Productivity', color: 'blue' },
            { name: 'Learning', color: 'purple' },
            { name: 'Mindfulness', color: 'pink' }
          ]
        }
      }
    }
  });

  // Finance Tracker
  const financeDb = await notion.databases.create({
    parent: { page_id: dashboard.id },
    icon: { emoji: '💰' },
    title: [{ text: { content: 'Financial Tracker' } }],
    properties: {
      'Description': { title: {} },
      'Type': {
        select: {
          options: [
            { name: 'Income', color: 'green' },
            { name: 'Expense', color: 'red' },
            { name: 'Investment', color: 'blue' },
            { name: 'Savings', color: 'purple' }
          ]
        }
      },
      'Category': {
        select: {
          options: [
            { name: 'Salary', color: 'green' },
            { name: 'Rent', color: 'red' },
            { name: 'Groceries', color: 'orange' },
            { name: 'Dining Out', color: 'yellow' },
            { name: 'Entertainment', color: 'purple' },
            { name: 'Transportation', color: 'blue' }
          ]
        }
      },
      'Amount': { number: { format: 'dollar' } },
      'Date': { date: {} },
      'Account': { rich_text: {} }
    }
  });

  console.log('✅ Life OS 2.0 built!');
  return dashboard.id;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Notion Template Builder...\n');

  // You need to provide a parent page ID where templates will be created
  const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

  if (!PARENT_PAGE_ID) {
    console.error('❌ Please set NOTION_PARENT_PAGE_ID environment variable');
    console.log('\nHow to get your page ID:');
    console.log('1. Open a blank Notion page');
    console.log('2. Copy the page URL: https://notion.so/username/PAGE_ID');
    console.log('3. Extract the PAGE_ID (the long string of letters/numbers)');
    console.log('4. Run: NOTION_PARENT_PAGE_ID=your_page_id node build-templates-auto.js');
    process.exit(1);
  }

  try {
    // Build all three templates
    console.log('Building templates in your Notion workspace...\n');

    const studentId = await buildStudentTemplate(PARENT_PAGE_ID);
    console.log('');

    const creatorId = await buildCreatorTemplate(PARENT_PAGE_ID);
    console.log('');

    const lifeOSId = await buildLifeOSTemplate(PARENT_PAGE_ID);
    console.log('');

    console.log('🎉 ALL TEMPLATES BUILT SUCCESSFULLY!\n');
    console.log('Next steps:');
    console.log('1. Open Notion and find your new templates');
    console.log('2. Customize them (add more example data, polish the design)');
    console.log('3. Create template links (Share → Template link)');
    console.log('4. Upload to Gumroad and start selling!\n');

    console.log('Template Links:');
    console.log(`Student System: https://notion.so/${studentId.replace(/-/g, '')}`);
    console.log(`Creator Hub: https://notion.so/${creatorId.replace(/-/g, '')}`);
    console.log(`Life OS: https://notion.so/${lifeOSId.replace(/-/g, '')}`);

  } catch (error) {
    console.error('❌ Error building templates:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  buildStudentTemplate,
  buildCreatorTemplate,
  buildLifeOSTemplate
};
