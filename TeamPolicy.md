# Roles:  
  
Coordinator: Marko Litovchenko  
Responsabilities:  
- Distribute and follow up of tasks  
- Ensure equal involvment from all parties  
- Take notes about dicussion topics and decisions made during/outside meetings  
  
Monitor: Thomas Proctor  
Responsabilities:  
- Ensure correct functionality implemention  
- Have a profound understanding of the handout  
  
Checker: Amirreza Mojtahedi  
Responsabilities:  
- Delivere the solution in CMS  
- Ensure that:  
    1) The proper group has been formed in CMS  
    2) The 'make check' always passes  
    3) Any ZIP files were constructed correctly  
    4) The uploaded files are exactly what the team intends  
    5) Everything is uploaded before the deadline  
  
# Meetings:  
  
Monday 14h15-14h30 - in person  
Wednesday 13h30-15h45 - in person  
Saturday 9h30-10h00, or Sunday 14h00-14h30 (backup) - online  
  
Response delay is expected to be not bigger than 12h, 24h at most  
Method of communication for online meetings: discord  
Method of communication outside meetings: gitlab issues or discord  
Alternative method of communication/reaching: cell phone number  
  
# Conflicts:  
  
If a teammate cannot be reached in any way there are two possible options:  
	1) If the deadline is too close to wait for a response, we will redistribute remaining tasks of the missing teammate and do the best to complete them  
	2) If there is still some time before the deadline, we keep working on our own tasks and wait until the teammate responds, then refer back to 1) in the worst case  
  
If two teammates have a disagreement, they involve the third teammate to be the judge  
If two teammates disagree upon the other one and no compromise can be established, the involvment of the teacher might be required  
  
# Coding style:  
  
- All major functions pushed to the codebase must have jsdocs  
- Avoid magic numbers  
- Use descriptive variable names  
- Leave comments around code that isn't obvious at fist glance  
- Follow official javascript naming conventions  
- Use helper methods to reduce functions length  
- Use commonjs for server side programming  
- Use modules to separate concerns (client and server side)  
- Follow commit message guidelines proposed by the teacher  
  
Note: Everyone writes their own unit tests, either right after the method that should be tested has been finalized, or at the complete end, when the app is functional  
  
# Expectations:  
  
We expect all teammates to:  
- Complete their work by the deadline, and in the worst case communicate as early as possible  
- Make significant exertion in order to participate in all meetings and respect meetings times (not come late or leave early)  
- Respect others' times: a teammate should ask for help after around 1h of unsuccessful debugging  
- Be independent when it comes to coding, learning or reasearching, but collaborative when the topic shifts to discussions or giving/receiving feedback  
- Be open minded about possible changes in design  

# Code review:
Code reviews will be done in the following fashion:
- Code reviews should be initiated once a merge request is opened, and the reviewers (team peers) have been added
- Frequency: The frequency of code reviews should be done once a feature is implemented and the developer believes it has been sufficiently completed
- Comments: Comments left in code reviews should be CLEAR AND CONCISE, they are meant to be helpful and meant to improve the overall code being reviewed 
- Suggestions, Praises, Todos, Potential - Problems, Coding style etc. are great things to have as comments
- An example of a bad comment: LGTM!
- An example of a good comment: This is great but be careful about your naming convention on the method blaBlaBla()

Sometimes code reviews can be done when someone is stuck, and they need help figuring out a bug:
- In this case a merge request could be opened for teammates to get to later
- Comments should be added with the potential bug clearly written out
- This is a useful time to take advantage of GitLab issues and tag the code with said issues within the merge request

At the end of a completed feature, merge request still open and bugs have been squashed:
- The monitor will check that the functionality of said feature lines up with the expected result
- The checker should make sure that ALL the coding conventions were followed
- And all in all, the quality of code being produced is of the expected standard
