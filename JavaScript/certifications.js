const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.certification-card').forEach(card => {
    observer.observe(card);
});

// Modal functionality
const modal = document.getElementById('certModal');
const modalClose = modal.querySelector('.modal-close');
const modalImage = modal.querySelector('.modal-image');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalTags = modal.querySelector('.modal-tags');
const modalLink = modal.querySelector('.modal-link');

const certificationData = {
    'gcp': {
        title: 'Google Cloud Professional DevOps Engineer',
        description: 'Demonstrates expertise in building and managing CI/CD pipelines, implementing monitoring and logging solutions, and managing cloud infrastructure using Google Cloud Platform.',
        image: '../Images/GCP.png',
        link: 'https://www.credly.com/badges/ce82054e-f3e8-49b8-a784-01d6d873abea/public_url',
        tags: ['GCP', 'DevOps', 'CI/CD', 'Cloud', 'Infrastructure', 'Automation', 'Monitoring', 'Security', 'Kubernetes', 'Containerization', 'Microservices', 'Cloud Build', 'Cloud Run', 'Cloud Functions', 'Logging', 'Metrics']
    },
    'aws-devops': {
        title: 'AWS Certified DevOps Engineer Professional',
        description: 'Professional showcases advanced technical expertise in provisioning, operating, and managing distributed application systems on AWS, giving you increased confidence and credibility with peers, colleagues, and customers. Organizations with these qualified professionals can ensure speedy delivery of secure and compliant systems that are highly available and scalable',
        image: '../Images/AWS-3.png',
        link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/c9c8a7aaf16f45c0bb0dfc044314ea7f',
        tags: ['AWS', 'DevOps', 'Cloud', 'Infrastructure', 'CI/CD', 'Automation', 'Security', 'High Availability', 'CodePipeline', 'CodeBuild', 'CodeDeploy', 'CloudFormation', 'ECS', 'EKS', 'Lambda', 'CloudWatch', 'Systems Manager']
    },
    'aws-dev': {
        title: 'AWS Certified Developer Associate',
        description: 'Associate showcases skills and knowledge in developing, optimizing, packaging, and deploying applications, using CI/CD workflows, and identifying and resolving application issues. This certification is a good starting point on the AWS Certification journey for individuals in IT or cloud developer job roles',
        image: '../Images/AWS-2.png',
        link: 'https://www.credly.com/badges/5f745ef9-f538-4174-b720-5822421954d4/public_url',
        tags: ['AWS', 'Development', 'Cloud', 'Applications', 'CI/CD', 'SDK', 'API', 'Serverless', 'DynamoDB', 'S3', 'Lambda', 'API Gateway', 'CloudWatch', 'X-Ray', 'IAM', 'Cognito', 'SQS', 'SNS', 'CloudFormation']
    },
    'aws-sa-pro': {
        title: 'AWS Certified Solutions Architect Professional',
        description: 'Focuses on the design of complex, scalable, and resilient cloud architectures across diverse business domains. This role is ideal for individuals with extensive experience in AWS Cloud or large-scale enterprise infrastructure. While the position does not require deep software development expertise, a strong understanding of automation, infrastructure as code, and architectural trade-offs is essential.',
        image: '../Images/AWS-5.png',
        link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/15d6e080a64344b8b16df5e355f0a54e',
        tags: ['AWS', 'Architecture', 'Cloud', 'Solutions', 'Security', 'Networking', 'Cost Optimization', 'Service Catalog', 'IoT', 'EFS', 'Organizations', 'Security Hub', 'CloudFront', 'Lambda', 'Migration', 'CloudWatch', 'IAM', 'SQS', 'Control Tower']
    },
    'aws-sa': {
        title: 'AWS Certified Solutions Architect Associate',
        description: 'Associate is focused on the design of cost and performance optimized solutions. This is an ideal starting point for candidates with AWS Cloud or strong on-premises IT experience. This exam does not require deep hands-on coding experience, although familiarity with basic programming concepts would be an advantage',
        image: '../Images/AWS.png',
        link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/fbba5ea756d04e449d71505cb4115595',
        tags: ['AWS', 'Architecture', 'Cloud', 'Solutions', 'Security', 'Networking', 'Cost Optimization', 'High Availability', 'VPC', 'EC2', 'S3', 'RDS', 'Route 53', 'CloudFront', 'ELB', 'Auto Scaling', 'CloudWatch', 'IAM', 'SQS', 'SNS']
    },
    'terraform': {
        title: 'HashiCorp Certified: Terraform Associate',
        description: 'The Terraform Associate certification is for Cloud Engineers specializing in operations, IT, or development who know the basic concepts and skills associated with Terraform. You understand what Terraform Enterprise features exist and can differentiate between Terraform Enterprise and Community Edition. You will be best prepared for this exam if you have professional experience using Terraform in production, but performing the exam objectives in a personal demo environment may be sufficient',
        image: '../Images/Terraform-Associate.png',
        link: 'https://www.credly.com/badges/66723a3b-d9b4-4e42-bb31-f4987a139fed/public_url',
        tags: ['Terraform', 'IaC', 'DevOps', 'Infrastructure', 'Automation', 'Cloud', 'Multi-Cloud', 'State Management', 'Modules', 'Providers', 'Resources', 'Data Sources', 'Variables', 'Outputs', 'Workspaces', 'Remote State', 'Backend Configuration', 'HCL']
    },
    'linux-essentials': {
        title: 'Linux Professional Institute Linux Essentials',
        description: "Linux adoption continues to rise world-wide as individual users, government entities and industries ranging from automotive to space exploration embrace open source technologies. This expansion of open source in enterprise is redefining traditional Information and Communication Technology (ICT) job roles to require more Linux skills. Whether you're starting your career in open source, or looking for advancement, independently verifying your skill set can help you stand out to hiring managers or your management team",
        image: '../Images/LinuxEssentials.png',
        link: 'https://cs.lpi.org/caf/Xamman/certification/verify/LPI000593257/8ypuy5hrnq',
        tags: ['Linux', 'Operating Systems', 'Open Source', 'Command Line', 'File Systems', 'Networking', 'Security', 'Shell Scripting', 'Package Management', 'User Management', 'Permissions', 'Processes', 'Text Processing', 'Basic Networking', 'System Administration', 'Bash', 'GNU Tools']
    },
    'lpic-1': {
        title: 'LPIC-1: Linux Administrator',
        description: "The LPIC-1 is designed to reflect current research and validate a candidate's proficiency in real world system administration.The objectives are tied to real- world job skills, which we determine through job task analysis surveying during exam development",
        image: '../Images/LPIC-1.png',
        link: 'https://cs.lpi.org/caf/Xamman/certification/verify/LPI000593257/8ypuy5hrnq',
        tags: ['Linux', 'System Administration', 'Networking', 'Security', 'Package Management', 'User Management', 'File Systems', 'Shell Scripting', 'Systemd', 'Kernel', 'Partitioning', 'DNS', 'DHCP', 'SSH', 'Firewall', 'Cron', 'Logging']
    },
    'aws-sys': {
        title: 'AWS Certified SysOps Administrator:',
        description: 'Associate validates skills and knowledge in monitoring and maintaining AWS workloads, implementing security controls and networking concepts, performing business continuity procedures, and implementing cost and performance optimizations.',
        image: '../Images/AWS-4.png',
        link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/187c09ee6c084dd184010fb73513eccf',
        tags: ['AWS', 'SysOps', 'Operations', 'Monitoring', 'Security', 'Networking', 'High Availability', 'Disaster Recovery', 'CloudWatch', 'CloudTrail', 'Config', 'Systems Manager', 'EC2', 'S3', 'RDS', 'VPC', 'Route 53', 'CloudFront', 'IAM', 'Backup', 'Maintenance Windows', 'Patch Management']
    },
    'gcp-arch': {
        title: 'Google Cloud Professional Cloud Architect',
        description: 'Professional Cloud Architects enable organizations to leverage Google Cloud technologies. With a thorough understanding of cloud architecture and Google Cloud, they design, develop, and manage robust, secure, scalable, efficient, cost-effective, highly available, and flexible solutions to drive business objectives',
        image: '../Images/GCP-2.png',
        link: 'https://www.credly.com/badges/804e9512-378c-40d0-9914-6ca2e45b1fd2/public_url',
        tags: ['GCP', 'Architecture', 'Cloud', 'Security', 'Networking', 'Cost Optimization', 'High Availability', 'Scalability', 'Migration', 'Automation', 'CI/CD']
    }
};

document.querySelectorAll('.certification-card').forEach(card => {
    card.addEventListener('click', () => {
        const certId = card.dataset.cert;
        const certData = certificationData[certId];

        modalImage.src = certData.image;
        modalImage.alt = certData.title;
        modalTitle.textContent = certData.title;
        modalDescription.textContent = certData.description;
        modalLink.href = certData.link;

        modalTags.innerHTML = certData.tags.map(tag =>
            `<span class="modal-tag">${tag}</span>`
        ).join('');

        modal.classList.add('active');
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});