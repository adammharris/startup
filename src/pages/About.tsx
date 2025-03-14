import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

const About: React.FC = () => {
  return (
    <Container fluid>
        <Card className='m-5 p-4 mx-auto' style={{ maxWidth: '800px' }}>
        <h1 className="m-auto">  About</h1>
        <hr/>
        <aside>
            <h3>ShowBrain is a different kind of social media.</h3> 
            <p>For those who prefer a slower, steadier pace, who don't want to get swept away in the flood of irresponsible oversharing— ShowBrain is here to fill that need.</p>
        </aside>
        <div>
            <p>
                Modern social media is built around engagement- specifically, getting as much of it as possible. This design philosophy favors participation over people, pitting the rising generation against billion-dollar corporations designed to make money off of their attention.
            </p>
            <blockquote cite="https://www.techtimes.com/articles/307600/20240923/impact-social-media-algorithms-public-opinion.htm">
                These algorithms don't just cater to your interests—they also amplify content that is likely to keep you scrolling, even if it's controversial or sensational. This is where the impact on public opinion comes into play. The content that's most likely to elicit strong reactions is what gets boosted, leading to the spread of ideas that might not have gained traction otherwise.
            </blockquote>
            <p>
                — "The Impact of Social Media Algorithms on Public Opinion," by Carl Williams, <a href="https://www.techtimes.com/articles/307600/20240923/impact-social-media-algorithms-public-opinion.htm">TechTimes</a>
            </p>
            <p>
                Our lives, our families, even our very government— none seem to be able to escape the vast influence of popular social media algorithms.
            </p>
            <p>
                Enter ShowBrain. ShowBrain is a quiet corner of the Internet designed to be a refuge from the social storm. Instead of being based on engagement, ShowBrain is based on <i>intention</i> and centered on <i>people</i>. There is no infinite-scroll "home page". Rather, there is one page for each person on the website, similar to a personal blog.
            </p>
            <p>
                Where ShowBrain really shines, however, is its robust permissions system designed to reflect the true nature of human relationships. For each post you make, you can attach any kind of tag you want based on who you would like to view the post. Add a "family" tag to let your family members see it. Add a "coworker" tag for your coworkers. Add a "friends from school" tag so your friends from school can see it!
            </p>
            <p>
                Each of these tags is totally custom to you. ShowBrain only provides a few base tags to get you started— the sky is the limit. This lets <i>you</i>, not an algorithm, manage <i>your</i> relationships.
            </p>
            <p>
                The same kinds of rules can apply to any aspect of your pages. Who should be allowed to comment? Who should be allowed to share or like? As ShowBrain grows, the power of this permissions system will shine even brighter.
            </p>
            <p>
                Hopefully ShowBrain's influence can make a mark on the Internet, and set a precedent for more genuine and human online interaction. And hopefully ShowBrain can help <i>you</i> find a voice in a world where it can be difficult to be heard.
            </p>
        </div>
        </Card>
    </Container>
  );
}

export default About;