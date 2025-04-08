import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ServiceLanding() {
  const { type } = useParams();
  const navigate = useNavigate();

  const getContent = () => {
    switch (type) {
      case 'daktari':
        return {
          title: 'Karibu Mifugo connect',
          subtitle: 'Jukwaa bora la kisasa linalowaleta pamoja wadau wote wa mifugo kwa manufaa ya madaktari, wafugaji na wadau wengine na manufaa ya nchi yetu kwa ujumla',
          description: 'Ongoza mapinduzi ya huduma kwa wafugaji mtandaoni upate faida zifuatazo:',
          benefits: [
            'Mauzo na faida zitaongezeka',
            'utawafikia wafugaji wengi zaidi na kwa urahisi',
            'utatoa huduma bora zaidi kwa wateja kupitia nyenzo za kiditali ndani ya mifugo connect',
            'utapunguza gharama za uendeshaji',
            'utapata umaarufu na kuaminika kupitia mifugo connect platfom'
          ],
          cta: 'Huu ni wakati wako Daktari ambae unatamani kutoa huduma kwa wafugaji wengi Zaidi. Utafanikisha hilo kupitia Mifugo Connect. Karibu Ujiunge nasi leo kirahisi kwa Kujisajili.'
        };
      case 'duka':
        return {
          title: 'KUZA BIASHARA YAKO. ONGEZA UFANISI WA FAIDA',
          subtitle: 'Sajili duka lako katika jukwaa hili la Mifugo connect upate faida zifutazo:',
          sections: [
            {
              title: '1. Idadi ya Wateja Kuongezeka',
              benefits: [
                'unatangazwa na kuonekana na watu sahihi katika soko sahihi',
                'Unakutanishwa na wateja halisi',
                'Unaunganishwa na masokp mapya'
              ]
            },
            {
              title: '2. Mifumo wezeshi ya Ugavi ndani ya mifugo connect itakisaidia',
              benefits: [
                'Kupunguza Gharama',
                'Kuongeza Faida',
                'Kutengeneza Fursa mpya za vipato'
              ]
            },
            {
              title: '3. Mifumo wezeshi ya huduma kwa wateja itakusaidia',
              benefits: [
                'Kuboresha huduma kwa wateja wako kua gharama ndogo',
                'Wateja watabaki na wewe muda mrefu'
              ]
            }
          ],
          cta: 'Usichelewe, Jiunge leo na Mifugo Connect.'
        };
      case 'wauzaji':
        return {
          title: 'RAHISISHA UUZAJI WA MIFUGO YAKO KIDIGITALI',
          subtitle: 'Karibu mifugo connect, jukwaa wezeshi linalokupatia fursa ya kuuza mifugo yako katika masoko ya utandawazi ili kukuinua kiuchumi.',
          description: 'Faida za kujiunga',
          benefits: [
            'Utapata wateja wengi zaidi kwasababu taarifa zako zitawafikia wanunuzi wengi zaidi kuliko awali',
            'Mifugo connect ina ondoa usumbufu na kupunguza gharama katika kutafuta masoko',
            'wewe mwenyewe ndie boss, una uhuru wa kufanya mawasiliano moja kwa moja na wateja',
            'Utapata dawa za mifugo, huduma za daktari na mahitaji mengine kwa urahisi ndani ya mifugo connect',
            'Fursa ya kuuza yako mengine ya mifugo kama ngozi, n.k',
            'Utapata mafunzo kupitia semina zetu jinsi ya kujipanga ili ukubalike na wanunuzi wengi.',
            'utapata usaidizi katika mchakato wa kuuza ikiwa utahitaji',
            'mifugo connect inakupa nafasi ya kuonekana, kujulikana na kutambulika nchini Tanzania na Ulimwenguni',
            'Utajifunza Mengi mengi kutoka kwa wafugaji wengine',
            'Hii ni fursa ya kutengeneza masoko endelevu na kupata wateja wa kudumu Kwa mantiki hiyo hii ni fursa ya faida endelevu na kipato cha kudumu'
          ],
          cta: 'usichelewe! Jiunge nasi leo'
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{content.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{content.subtitle}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {content.sections ? (
              // For Duka layout with sections
              content.sections.map((section, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-green-500">•</span>
                        <span className="ml-3 text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              // For Daktari and Wauzaji layout
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{content.description}</h2>
                <ul className="space-y-4">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-green-500">•</span>
                      <span className="ml-3 text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8">{content.cta}</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate(`/register/${type}`)}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
              >
                Jisajili Sasa
              </button>
              <button
                onClick={() => navigate(`/services/${type}`)}
                className="inline-flex items-center px-8 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 hover:bg-green-50 md:py-4 md:text-lg md:px-10"
              >
                Tazama Orodha
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceLanding; 